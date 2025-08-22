import type { Plugin, ViteDevServer } from 'vite'

import { spawn } from 'child_process'
import { Server } from 'http'
import { Socket, Server as WebSocketServer } from 'socket.io'

export interface AppStatus {
  appName: string
  appPort: number
  command: string
  status: 'error' | 'running' | 'starting' | 'stopped'
  timestamp: Date
}

const appRuningCache: AppStatus[] = []

let checkInterval: NodeJS.Timeout

const startPortChecking = () => {
  if (checkInterval) clearInterval(checkInterval)

  // 定期检查应用端口
  checkInterval = setInterval(async () => {
    for (const appStatus of appRuningCache) {
      // 检查应用是否已启动
      try {
        await fetch(`http://localhost:${appStatus.appPort}`)
        appStatus.status = 'running'
        console.log(`应用 ${appStatus.appName} 已启动`)
      } catch (error) {
        console.log(error)
        appStatus.status = 'stopped'
      }
    }
  }, 2000)
}

export function vitePluginAppMonitor(): Plugin {
  let httpServer: Server
  let wsServer: WebSocketServer

  console.log('appRuningCache', appRuningCache)

  return {
    configureServer(server: ViteDevServer) {
      httpServer = server.httpServer as Server

      // 创建WebSocket服务器
      wsServer = new WebSocketServer(httpServer, {
        path: '/_app-monitor-ws',
        serveClient: false
      })

      // 处理WebSocket连接
      wsServer.on('connection', (socket: Socket) => {
        // 监听客户端消息
        socket.on('command', (appStatus: AppStatus) => {
          spawn(appStatus.command, { shell: true, stdio: 'inherit' })
          socket.emit('status-update', appStatus)
        })
      })

      startPortChecking()
    },

    // launchApplication() {
    //   try {
    //     this.setStatus('starting', `执行启动命令: ${options.launchCommand} ${options.launchArgs?.join(' ') || ''}`)

    //     // 启动子进程
    //     appProcess = spawn(options.launchCommand, options.launchArgs || [], {
    //       shell: true,
    //       stdio: 'pipe'
    //     })

    //     // 处理标准输出
    //     appProcess.stdout?.on('data', data => {
    //       const output = data.toString()
    //       console.log(`[App] ${output}`)

    //       // 广播日志输出
    //       if (wsServer) {
    //         wsServer.emit('log-output', {
    //           message: output,
    //           timestamp: new Date(),
    //           type: 'stdout'
    //         })
    //       }

    //       // 检查应用启动成功的标志
    //       if (output.includes('Local:') || output.includes('http://')) {
    //         this.setStatus('running', '应用启动成功')
    //       }
    //     })

    //     // 处理错误输出
    //     appProcess.stderr?.on('data', data => {
    //       const output = data.toString()
    //       console.error(`[App] ${output}`)

    //       // 广播错误输出
    //       if (wsServer) {
    //         wsServer.emit('log-output', {
    //           message: output,
    //           timestamp: new Date(),
    //           type: 'stderr'
    //         })
    //       }
    //     })

    //     // 处理进程退出
    //     appProcess.on('close', code => {
    //       this.setStatus('stopped', `应用进程已退出，代码: ${code}`)
    //       appProcess = null
    //     })

    //     appProcess.on('error', err => {
    //       this.setStatus('error', `启动应用时出错: ${err.message}`)
    //       console.error('启动应用失败:', err)
    //     })
    //   } catch (error) {
    //     this.setStatus('error', `启动应用时异常: ${(error as Error)?.message}`)
    //     console.error('启动应用异常:', error)
    //   }
    // },

    name: 'vite-plugin-app-monitor'

    // setStatus(status: AppStatus['status'], message?: string) {
    //   currentStatus = {
    //     message,
    //     port: options.appPort,
    //     status,
    //     timestamp: new Date()
    //   }

    //   // 广播状态更新
    //   if (wsServer) {
    //     wsServer.emit('status-update', currentStatus)
    //   }

    //   console.log(`[AppMonitor] ${status}: ${message || ''}`)
    // },

    // // 自定义方法
    // startAppMonitoring() {
    //   this.setStatus('starting', '启动应用监控...')

    //   // 启动应用
    //   this.launchApplication()

    //   // 开始端口检测
    //   this.startPortChecking()
    // },

    // startPortChecking() {
    //   // 定期检查应用端口
    //   const checkInterval = setInterval(async () => {
    //     if (currentStatus.status === 'stopped' || currentStatus.status === 'error') {
    //       clearInterval(checkInterval)
    //       return
    //     }

    //     const isPortOpen = await this.checkPort(options.appPort)

    //     if (isPortOpen && currentStatus.status !== 'running') {
    //       this.setStatus('running', '应用端口已就绪')
    //     } else if (!isPortOpen && currentStatus.status === 'running') {
    //       this.setStatus('error', '应用端口无法访问')
    //     }
    //   }, 2000)
    // },

    // // 提供API路由给前端
    // transformIndexHtml(html: string) {
    //   // 注入监控客户端脚本
    //   if (viteServer?.config.command === 'serve') {
    //     return html.replace('</head>', `<script type="module" src="/@app-monitor-client"></script></head>`)
    //   }
    //   return html
    // }
  }
}
