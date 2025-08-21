import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import type { AxiosPluginType } from '../core'

// 扩展 Axios 类型定义
declare module 'axios' {
  interface AxiosRequestConfig {
    cancelDuplicate?: boolean
  }
}

// 内部使用的扩展类型
interface InternalRequestConfig extends InternalAxiosRequestConfig {
  __controller?: AbortController
  __generatedKey?: string
}

const generateKey = (config: AxiosRequestConfig): string => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`
}

export default (): AxiosPluginType => {
  const duplicateMap = new Map<string, AbortController>()

  return {
    request(config: InternalRequestConfig) {
      if (config.cancelDuplicate) {
        const key = generateKey(config)
        config.__generatedKey = key

        if (duplicateMap.has(key)) {
          duplicateMap.get(key)?.abort()
          duplicateMap.delete(key)
        }

        const controller = new AbortController()
        config.signal = controller.signal
        config.__controller = controller
        duplicateMap.set(key, controller)
      }

      return config
    },

    response(response: AxiosResponse) {
      const config = response?.config as InternalRequestConfig
      if (config?.cancelDuplicate) {
        const key = config.__generatedKey
        if (key && duplicateMap.get(key) === config.__controller) {
          duplicateMap.delete(key)
        }
      }

      return response
    },

    responseError(error: AxiosError) {
      const config = error?.config as InternalRequestConfig
      if (config?.cancelDuplicate) {
        const key = config.__generatedKey
        if (key && duplicateMap.get(key) === config.__controller) {
          duplicateMap.delete(key)
        }
      }

      return error
    }
  }
}
