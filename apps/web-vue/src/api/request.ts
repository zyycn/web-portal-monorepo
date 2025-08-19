import axios from '@packages/request'
import { useAxiosPlugin } from '@packages/request/core'
import { auth, error, serializer, sign, withParams } from '@packages/request/plugins'
import { generateRandomId } from '@packages/utils'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

const axiosPlugin = new useAxiosPlugin()

axiosPlugin.use(serializer())

axiosPlugin.use(
  withParams(() => {
    return {
      userId: ''
    }
  })
)

axiosPlugin.use(
  sign(() => {
    return {
      params: {
        appCode: 'bbs',
        tId: generateRandomId(),
        ts: new Date().getTime()
      },
      salt: 'salt'
    }
  })
)

axiosPlugin.use(
  auth(() => {
    return sessionStorage.getItem('token')
  })
)

axiosPlugin.use(error())

axiosPlugin.install(request)

export default request
