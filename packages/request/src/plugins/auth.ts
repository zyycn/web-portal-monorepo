import type { AxiosPlugin } from '../core'

export default (getToken: () => null | string): AxiosPlugin => {
  return {
    request(config) {
      const token = getToken() || ''

      config.headers['Authorization'] = token

      return config
    }
  }
}
