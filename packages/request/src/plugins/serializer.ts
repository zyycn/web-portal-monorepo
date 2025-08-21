import { stringify } from 'qs'

import type { AxiosPluginType } from '../core'

export default (arrayFormat?: 'comma'): AxiosPluginType => {
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
