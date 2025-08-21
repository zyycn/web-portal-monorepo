import { defineConfig } from '@internal/vite-config'

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      proxy: {
        // 审计模块
        '/audit-system': {
          changeOrigin: true,
          target: 'http://localhost:6003', // 最终代理地址为 http://localhost:6003/audit-system
          ws: true
        },
        // 登录页
        '/login': {
          changeOrigin: true,
          target: 'http://localhost:6001',
          ws: true
        },
        // Portal
        '/portal': {
          changeOrigin: true,
          target: 'http://localhost:6002',
          ws: true
        }
      }
    }
  }
})
