import type { AxiosPlugin } from '../core'

export default (refresh: () => Promise<void>): AxiosPlugin => {
  return {
    response: async (response, instance) => {
      const { config, data } = response

      if (data.code.startsWith('10')) {
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
