import { isCancel } from 'axios'

import type { AxiosPlugin } from '../core'

// 错误消息映射函数
function getErrorMessage(code?: string, message?: string): string {
  const errorMap: Record<string, string> = {
    ECONNABORTED: '接口请求超时,请刷新页面重试',
    NETWORK_ERROR: '网络异常，请检查您的网络连接是否正常'
  }

  if (code && errorMap[code]) return errorMap[code]
  if (message?.includes('timeout')) return errorMap.ECONNABORTED
  if (message?.includes('Network Error')) return errorMap.NETWORK_ERROR
  return '请求似乎遇到了问题，请稍后重试'
}

const error = (callback?: (message: string) => void): AxiosPlugin => {
  return {
    responseError(error) {
      if (isCancel(error)) return error

      if (callback) callback(getErrorMessage(error.code, error.message))

      return error
    }
  }
}

export { error }
