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

    const findApp = find(this.apps.value, { appName: app.appName })
    if (findApp) Object.assign(findApp, app)
  }
}

// 初始化监控客户端
const appMonitorClient = new AppMonitorClient()

const apps = computed(() => appMonitorClient.apps.value)

const startApp = (app: App) => {
  appMonitorClient.startApp(app.appName)
}

const stopApp = (app: App) => {
  appMonitorClient.stopApp(app.appName)
}

const openAppInBrowser = (app: App) => {
  window.open(`/${app.appName}`, '_blank')
}
</script>

<template>
  <el-card class="m-20">
    <el-table border :data="apps">
      <el-table-column label="应用名称" prop="appName" />
      <el-table-column label="真实端口" prop="appPort" />
      <el-table-column label="代理端口" prop="appProxyPort" />
      <el-table-column label="更新时间" prop="timestamp" />
      <el-table-column label="启动命令" width="340" prop="appCommand" />
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'running'" type="success">运行中</el-tag>
          <el-tag v-else-if="scope.row.status === 'starting'" type="warning">启动中</el-tag>
          <el-tag v-else-if="scope.row.status === 'stopped'" type="danger">已停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="PID" prop="pid" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="primary" :disabled="scope.row.status !== 'stopped'" size="small" @click="startApp(scope.row)">启动</el-button>
          <el-button type="danger" :disabled="scope.row.status !== 'running'" size="small" @click="stopApp(scope.row)">停止</el-button>
          <el-button type="success" :disabled="scope.row.status !== 'running'" size="small" @click="openAppInBrowser(scope.row)">打开</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
