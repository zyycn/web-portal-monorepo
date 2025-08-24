import { defineConfig } from '@internal/vite-config'

import { vitePluginAppMonitor } from './plugins/vite-plugin-app-monitor'

// 应用信息
const apps = [
  {
    appCommand: 'pnpm --filter=@apps/login dev',
    appName: 'login',
    appPort: 6001
  },
  {
    appCommand: 'pnpm --filter=@apps/portal dev',
    appName: 'portal',
    appPort: 6002
  },
  {
    appCommand: 'pnpm --filter=@apps/audit-system dev',
    appName: 'audit-system',
    appPort: 6003
  }
]

// 代理信息
interface Proxy {
  changeOrigin: boolean
  target: string
  ws: boolean
}
const proxy = apps.reduce(
  (acc, app) => {
    acc[`/${app.appName}`] = {
      changeOrigin: true,
      target: `http://localhost:${app.appPort}`,
      ws: true
    }
    return acc
  },
  {} as Record<string, Proxy>
)

export default defineConfig(() => {
  return {
    plugins: [
      vitePluginAppMonitor({
        apps,
        verbose: true
      })
    ],
    server: {
      port: 3000,
      proxy
    }
  }
})
