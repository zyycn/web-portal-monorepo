interface App {
  appCommand: string
  appName: string
  appPort: number
  appProxyPort?: number
  pid?: null | number
  status?: 'running' | 'starting' | 'stopped'
  timestamp?: Date | string
}
