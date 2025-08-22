<script setup lang="ts">
import type { Socket } from 'socket.io-client'

import { io } from 'socket.io-client'

interface AppStatus {
  appName: string
  appPort: number
  command: string
  status: 'error' | 'running' | 'starting' | 'stopped'
  timestamp: Date
}

class AppMonitorClient {
  public status: any
  private socket: Socket | undefined

  constructor() {
    this.connectWebSocket()
  }

  public sendCommand(command: AppStatus) {
    this.socket?.emit('command', command)
  }

  private connectWebSocket() {
    this.socket = io({
      path: '/_app-monitor-ws'
    })

    this.socket.on('connect', () => {
      // this.updateStatus('starting', '已连接到监控服务器')
    })

    this.socket.on('disconnect', () => {
      // this.updateStatus('error', '与监控服务器的连接已断开')
    })

    this.socket.on('status-update', (status: AppStatus) => {
      this.updateStatus(status)
      console.log(this.status)
    })
  }

  private updateStatus(status: AppStatus) {
    this.status = status
  }
}

// 初始化监控客户端
const appMonitorClient = new AppMonitorClient()

// 发送事件
const sendCommand = (command: AppStatus) => {
  appMonitorClient.sendCommand(command)
}

const apps = [
  {
    appName: 'login',
    appPort: 6001,
    command: 'pnpm --filter=@apps/login dev'
  },
  {
    appName: 'portal',
    appPort: 6002,
    command: 'pnpm --filter=@apps/portal dev'
  },
  {
    appName: 'audit-system',
    appPort: 6003,
    command: 'pnpm --filter=@apps/audit-system dev'
  }
]
</script>

<template>
  <el-card class="m-20">
    <el-table border :data="apps">
      <el-table-column label="应用名称" prop="appName" />
      <el-table-column label="应用端口" prop="appPort" />
      <el-table-column label="启动命令" prop="command" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="sendCommand(scope.row)">启动</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
