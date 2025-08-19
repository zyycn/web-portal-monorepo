import { stringify } from 'qs'

import type { AxiosPlugin } from '../core'

export default (arrayFormat?: 'comma'): AxiosPlugin => {
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
