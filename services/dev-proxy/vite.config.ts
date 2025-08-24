import { defineConfig } from '@internal/vite-config'
import { loadEnv } from 'vite'

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

export default defineConfig(({ mode }) => {
  const { VITE_APP_PORT, VITE_APP_PREFIX } = loadEnv(mode, process.cwd())

  return {
    base: `/${VITE_APP_PREFIX}`,
    plugins: [
      vitePluginAppMonitor({
        apps
      })
    ],
    server: {
      port: Number(VITE_APP_PORT),
      proxy
    }
  }
})
