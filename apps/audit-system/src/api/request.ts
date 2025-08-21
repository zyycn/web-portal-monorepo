import axios from '@packages/request'
import { useAxiosPlugin } from '@packages/request/core'
import plugins from '@packages/request/plugins'
import { generateRandomId } from '@packages/utils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const REQUEST_TIMEOUT = 10000
const APP_CODE = 'bbs'

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT
})

const requestPlugin = new useAxiosPlugin()

const getWithParams = () => ({
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

const getNewToken = () => {
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

requestPlugin.use(plugins.serializer())
requestPlugin.use(plugins.withParams(getWithParams))
requestPlugin.use(plugins.sign(getSignParams))
requestPlugin.use(plugins.auth(getToken))
requestPlugin.use(plugins.refreshToken(getNewToken))
requestPlugin.use(plugins.error(handleError))
requestPlugin.use(plugins.busiCode(handleError))

requestPlugin.install(request)

export default request
