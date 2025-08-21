import type { AxiosPlugin } from '../core'

export default (refresh: () => Promise<void>): AxiosPlugin => {
  return {
    response: async (response, instance) => {
      const { config, data } = response

      // 1010:Access token无效
      // 1011:Access token已过期
      if ([1010, 1011].includes(data.code)) {
        try {
          await refresh()
          return instance(config) // 重新发送原始请求
        } catch {
          return Promise.reject(data)
        }
      }

      return response
    }
  }
}
