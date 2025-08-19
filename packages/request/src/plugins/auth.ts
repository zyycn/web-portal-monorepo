import type { AxiosPlugin } from '../core'

const auth = (getToken: () => null | string): AxiosPlugin => {
  return {
    request(config) {
      const token = getToken() || ''

      config.headers['Authorization'] = token

      return config
    }
  }
}

export { auth }
