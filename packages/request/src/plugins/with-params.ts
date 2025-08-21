import type { AxiosPluginType } from '../core'

/**
 * 用于请求携带一些公共参数
 * @param getParams
 * @returns
 */
export default (getParams?: () => Record<string, number | string>): AxiosPluginType => {
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
