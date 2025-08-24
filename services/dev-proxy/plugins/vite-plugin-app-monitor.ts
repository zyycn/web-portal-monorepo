import type { Plugin, ViteDevServer } from 'vite'

import { ChildProcess, spawn } from 'child_process'
import { consola } from 'consola'
import dayjs from 'dayjs'
import { find } from 'es-toolkit/compat'
import { Server } from 'http'
import { Socket, Server as WebSocketServer } from 'socket.io'
import kill from 'tree-kill-promise'

interface PluginConfig {
  apps: App[]
  verbose?: boolean
}

type UpdateApp = Omit<App, 'appCommand' | 'appPort'> & {
  appCommand?: App['appCommand']
  appPort?: App['appPort']
}

export function vitePluginAppMonitor(options: PluginConfig): Plugin {
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
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
  })

  const log = (message: string) => {
    if (!verbose) return
    consola.log(`🚀 [Vite Plugin App Monitor] ${message}`)
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
              log(`应用 ${app.appName} 已启动`)

              updateApp({
                appName: app.appName,
                status: 'running'
              })

              // 广播状态更新
              if (state.wsServer) {
                state.wsServer.emit('status-update', app)
              }
            }
          }
        } catch {
          // 连接失败，应用可能未运行
          if (app.status !== 'stopped' && app.status !== 'starting') {
            log(`应用 ${app.appName} 已停止`)

            updateApp({
              appName: app.appName,
              status: 'stopped'
            })

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
    updateApp({
      appName: app.appName,
      pid: null,
      status: 'stopped'
    })

    // 更新缓存
    const findApp = find(state.apps, { appName: app.appName })
    if (findApp) Object.assign(findApp, app)

    // 广播状态更新
    state.wsServer?.emit('status-update', app)
  }

  const updateApp = (app: UpdateApp) => {
    const findApp = find(state.apps, { appName: app.appName })

    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
    if (findApp) Object.assign(findApp, { ...app, timestamp })
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
        } catch {
          log(`终止应用 ${appName} 失败：`)
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
          updateApp({
            appName: app.appName,
            status: 'starting'
          })

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

            child.on('error', () => {
              log(`启动应用 ${app.appName} 失败:`)
              handleError(app, child)
            })
          } catch {
            log(`启动应用 ${app.appName} 异常:`)

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

            updateApp({
              appName: app.appName,
              pid: null,
              status: 'stopped'
            })

            log(`已停止应用 ${appName} (PID: ${app.pid})`)
          } catch {
            log(`停止应用 ${appName} 失败：`)
          }
        })
      })

      startPortChecking()
    },

    name: 'vite-plugin-app-monitor'
  }
}
