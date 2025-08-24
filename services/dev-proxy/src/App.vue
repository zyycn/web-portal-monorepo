<script setup lang="ts">
import type { Socket } from 'socket.io-client'

import { find } from 'es-toolkit/compat'
import { io } from 'socket.io-client'

class AppMonitorClient {
  public apps: { value: App[] }
  public socket: Socket | undefined

  constructor() {
    this.socket = undefined
    this.apps = ref<App[]>([])
    this.connectWebSocket()
  }

  public startApp(appName: App['appName']) {
    this.socket?.emit('start-app', appName)
  }

  public stopApp(appName: App['appName']) {
    this.socket?.emit('stop-app', appName)
  }

  private connectWebSocket() {
    this.socket = io({
      path: '/_app-monitor-ws'
    })

    this.socket.on('app-list', (apps: App[]) => {
      this.apps.value = apps
    })

    this.socket.on('status-update', (app: App) => {
      this.updateApp(app)
    })
  }

  private updateApp(app: App) {
    if (!this.apps) return

    console.log(app)

    const findApp = find(this.apps.value, { appName: app.appName })
    if (findApp) Object.assign(findApp, app)
  }
}

// 初始化监控客户端
const appMonitorClient = new AppMonitorClient()

const apps = computed(() => appMonitorClient.apps.value)

// 发送事件
const startApp = (app: App) => {
  appMonitorClient.startApp(app.appName)
}

const stopApp = (app: App) => {
  appMonitorClient.stopApp(app.appName)
}
</script>

<template>
  <el-card class="m-20">
    <el-table border :data="apps">
      <el-table-column label="应用名称" prop="appName" />
      <el-table-column label="应用端口" prop="appPort" />
      <el-table-column label="启动命令" prop="appCommand" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="PID" prop="pid" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" :disabled="scope.row.status !== 'stopped'" @click="startApp(scope.row)">启动</el-button>
          <el-button type="danger" :disabled="scope.row.status !== 'running'" @click="stopApp(scope.row)">停止</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
