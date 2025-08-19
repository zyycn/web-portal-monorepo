import type { AxiosPlugin } from '../core'

/**
 * 用于请求携带一些公共参数
 * @param getParams
 * @returns
 */
const withParams = (getParams?: () => Record<string, number | string>): AxiosPlugin => {
  return {
    request(config) {
      const params = getParams ? getParams() : {}

      if (config.method) {
        if (['delete', 'get', 'head', 'options'].includes(config.method)) {
          config.params = Object.assign({}, config.params, params)
        } else {
          config.data = Object.assign({}, config.data, params)
        }
      }

      return config
    }
  }
}

export { withParams }
