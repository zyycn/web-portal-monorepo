import { stringify } from 'qs'

import type { AxiosPlugin } from '../core'

const serializer = (arrayFormat?: 'comma'): AxiosPlugin => {
  return {
    request(config) {
      if (config.params) {
        config.paramsSerializer = {
          serialize: params => {
            return stringify(params, { arrayFormat })
          }
        }
      }
      return config
    }
  }
}

export { serializer }
