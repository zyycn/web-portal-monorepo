import type { AxiosPluginType } from '../core'

export default (getToken: () => null | string): AxiosPluginType => {
  return {
    request(config) {
      const token = getToken() || ''

      config.headers['Authorization'] = token

      return config
    }
  }
}
