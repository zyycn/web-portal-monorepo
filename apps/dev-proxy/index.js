import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

// 代理配置
const proxies = {
  '/audit-system': {
    changeOrigin: true,
    target: 'http://localhost:6003/audit-system' // 审计模块
  },
  '/login': {
    changeOrigin: true,
    target: 'http://localhost:6001/login' // 登录页应用
  },
  '/portal': {
    changeOrigin: true,
    target: 'http://localhost:6002/portal' // Portal应用
  }
}

// 设置代理
Object.keys(proxies).forEach(path => {
  app.use(path, createProxyMiddleware(proxies[path]))
})

// 启动代理服务器
app.listen(3000, () => {
  console.log('开发代理服务器运行在 http://localhost:3000')
})
