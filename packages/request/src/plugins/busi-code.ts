import type { AxiosPlugin } from '../core'

export default (callback?: (message: string) => void): AxiosPlugin => {
  return {
    response(response) {
      const { data } = response

      if (data.code !== '0000') {
        const message = data.msg || '服务异常，请稍后重试'
        callback?.(message)
        return Promise.reject(message)
      }

      return data.body
    }
  }
}
