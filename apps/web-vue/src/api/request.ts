import axios from '@packages/request'
import { useAxiosPlugin } from '@packages/request/core'
import * as plugins from '@packages/request/plugins'
import { generateRandomId } from '@packages/utils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const REQUEST_TIMEOUT = 10000
const APP_CODE = 'bbs'

// 创建请求实例
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT
})

// 创建插件实例
const requestPlugin = new useAxiosPlugin()

const getDynamicParams = () => ({
  userId: ''
})

const getSignParams = () => ({
  params: {
    appCode: APP_CODE,
    tId: generateRandomId(),
    ts: new Date().getTime()
  },
  salt: ''
})

const getToken = () => {
  return sessionStorage.getItem('token')
}

const handleError = (message: string) => {
  ElMessage.error(message)
}

requestPlugin.use(plugins.serializer())
requestPlugin.use(plugins.withParams(getDynamicParams))
requestPlugin.use(plugins.sign(getSignParams))
requestPlugin.use(plugins.auth(getToken))
requestPlugin.use(plugins.busiCode(handleError))
requestPlugin.use(plugins.error(handleError))

requestPlugin.install(request)

export default request
