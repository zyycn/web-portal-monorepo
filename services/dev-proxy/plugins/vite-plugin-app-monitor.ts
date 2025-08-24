import type { Plugin, ViteDevServer } from 'vite'

import { ChildProcess, spawn } from 'child_process'
import { consola } from 'consola'
import { find } from 'es-toolkit/compat'
import { Server } from 'http'
import { Socket, Server as WebSocketServer } from 'socket.io'
import kill from 'tree-kill-promise'

interface PluginConfig {
  apps: App[]
  verbose?: boolean
}

export function vitePluginAppMonitor(options: PluginConfig): Plugin {
  // 使用 ref 对象来存储状态，确保引用不变但内容可变
  const state = {
    apps: [] as App[],
    checkInterval: null as NodeJS.Timeout | null,
    httpServer: null as null | Server,
    processes: new Map<number, ChildProcess>(), // 跟踪进程ID和应用状态的映射
    wsServer: null as null | WebSocketServer
  }

  const { apps = [], verbose = false } = options
  apps.forEach(app => {
    state.apps.push({
      ...app,
      pid: null,
      status: 'stopped',
      timestamp: new Date()
    })
  })

  const log = (message: string, ...args: any[]) => {
    if (!verbose) return
    consola.log(`🚀 [Vite Plugin App Monitor] ${message}`, ...args)
  }

  const startPortChecking = () => {
    if (state.checkInterval) {
      clearInterval(state.checkInterval)
    }

    state.checkInterval = setTimeout(async () => {
      for (const app of state.apps) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 500)
          const response = await fetch(`http://localhost:${app.appPort}`, {
            signal: controller.signal
          })
          clearTimeout(timeoutId)

          if (response && response.status < 500) {
            if (app.status !== 'running') {
              app.status = 'running'
              app.timestamp = new Date()
              log(`应用 ${app.appName} 已启动`)

              // 广播状态更新
              if (state.wsServer) {
                state.wsServer.emit('status-update', app)
              }
            }
          }
        } catch {
          // 连接失败，应用可能未运行
          if (app.status !== 'stopped' && app.status !== 'starting') {
            app.status = 'stopped'
            app.timestamp = new Date()
            log(`应用 ${app.appName} 已停止`)
            // 广播状态更新
            if (state.wsServer) {
              state.wsServer.emit('status-update', app)
            }
          }
        }
      }

      startPortChecking()
    }, 1000)
  }

  const handleError = (app: App, child: ChildProcess) => {
    state.processes.delete(child.pid || 0)

    // 更新状态
    app.pid = null
    app.status = 'stopped'
    app.timestamp = new Date()

    // 更新缓存
    const findApp = find(state.apps, { appName: app.appName })
    if (findApp) Object.assign(findApp, app)

    // 广播状态更新
    state.wsServer?.emit('status-update', app)
  }

  return {
    // 插件关闭时清理资源
    async closeBundle() {
      if (state.checkInterval) {
        clearInterval(state.checkInterval)
        state.checkInterval = null
      }

      // 关闭所有运行中的应用
      for (const { appName, pid } of state.apps) {
        try {
          if (pid) await kill(pid)
          log(`已终止应用 ${appName} (PID: ${pid})`)
        } catch (error) {
          log(`终止应用 ${appName} 失败：`, error)
        }
      }
      state.processes.clear()

      if (state.wsServer) {
        state.wsServer.close()
        state.wsServer = null
      }
    },

    configureServer(server: ViteDevServer) {
      state.httpServer = server.httpServer as Server

      // 创建WebSocket服务器
      state.wsServer = new WebSocketServer(state.httpServer, {
        path: '/_app-monitor-ws',
        serveClient: false
      })

      // 处理WebSocket连接
      state.wsServer.on('connection', (socket: Socket) => {
        // 发送当前所有应用状态
        socket.emit('app-list', state.apps)

        // 监听启动应用命令
        socket.on('start-app', (appName: App['appName']) => {
          // 添加到缓存
          const app = find(state.apps, { appName })
          if (!app) return

          if (app.status === 'running' || app.status === 'starting') {
            // 如果应用已经在运行，忽略启动请求
            log(`应用 ${app.appName} 已在运行，忽略启动请求`)
            return
          }

          // 更新状态为 starting
          app.status = 'starting'
          app.timestamp = new Date()

          log(`正在启动应用 ${app.appName}...`)

          // 广播状态更新
          socket.emit('status-update', app)

          try {
            // 执行命令，使用 inherit 将输出直接传递到父进程
            const child = spawn(app.appCommand, {
              detached: process.platform !== 'win32', // 在非Windows平台使子进程独立
              shell: true,
              stdio: 'inherit'
            })

            // 保存进程ID
            app.pid = child.pid
            if (child.pid) state.processes.set(child.pid, child)

            // 监听进程退出
            child.on('close', () => {
              handleError(app, child)
            })

            child.on('error', err => {
              log(`启动应用 ${app.appName} 失败:`, err)
              handleError(app, child)
            })
          } catch (error) {
            log(`启动应用 ${app.appName} 异常:`, error)

            const child = state.processes.get(app.pid || 0)
            if (child) handleError(app, child)
          }
        })

        // 监听停止应用命令
        socket.on('stop-app', async (appName: string) => {
          const app = find(state.apps, { appName })
          if (!app || !app.pid) return

          try {
            // 终止进程
            log(`正在停止应用 ${appName} (PID: ${app.pid})...`)

            await kill(app.pid)
            // 更新状态
            app.pid = undefined
            app.status = 'stopped'
            app.timestamp = new Date()

            log(`已停止应用 ${appName} (PID: ${app.pid})`)
          } catch (error) {
            log(`停止应用 ${appName} 失败：`, error)
          }
        })
      })

      startPortChecking()
    },

    // 添加热重载处理
    handleHotUpdate() {
      // 保持现有状态
      return []
    },

    name: 'vite-plugin-app-monitor'
  }
}
