interface App {
  appCommand: string
  appName: string
  appPort: number
  pid?: null | number
  status?: 'error' | 'running' | 'starting' | 'stopped'
  timestamp?: Date
}
