import axios, { type AxiosInstance, type AxiosRequestConfig } from '@packages/request'
import { AxiosPlugin } from '@packages/request/core'
import plugins from '@packages/request/plugins'
import { generateRandomId } from '@packages/utils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const REQUEST_TIMEOUT = 10000
const APP_CODE = 'bbs'

// 创建axios实例
const createHttpClient = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT
  })
}

const getCommonReqParams = () => ({
  userId: ''
})

const getSignParams = () => ({
  params: {
    appCode: APP_CODE,
    requestId: generateRandomId(),
    timestamp: new Date().getTime()
  },
  salt: ''
})

const getAuthToken = () => {
  return sessionStorage.getItem('token')
}

const refreshAuthToken = () => {
  console.log('刷新token')
  return Promise.resolve()
}

const handleError = (message: string) => {
  ElMessage({
    message,
    plain: true,
    type: 'error'
  })
}

const configReqPlugins = (AxiosPlugin: AxiosPlugin, httpClient: AxiosInstance) => {
  AxiosPlugin.use(plugins.serializer())
  AxiosPlugin.use(plugins.withParams(getCommonReqParams))
  AxiosPlugin.use(plugins.sign(getSignParams))
  AxiosPlugin.use(plugins.auth(getAuthToken))
  AxiosPlugin.use(plugins.refreshToken(refreshAuthToken))
  AxiosPlugin.use(plugins.error(handleError))
  AxiosPlugin.use(plugins.busiCode(handleError))
  AxiosPlugin.install(httpClient)
}

const httpClient = createHttpClient()

// 配置插件
configReqPlugins(new AxiosPlugin(), httpClient)

function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return httpClient.request(config)
}

export default request
