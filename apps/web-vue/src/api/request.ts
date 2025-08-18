import axios from '@packages/request'
import { cancel, error, limit, PluginManager } from '@packages/request/plugins'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

const plugins = new PluginManager()

plugins.use(cancel())
plugins.use(limit())
plugins.use(error())

plugins.install(request)

export default request
