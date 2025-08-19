import { toSortedKeyValueString } from '@packages/utils'
import SHA256 from 'crypto-js/sha256'
import { cloneDeep } from 'es-toolkit'
import { stringify } from 'qs'

import type { AxiosPlugin } from '../core'

interface SignParmas {
  params?: Record<string, number | string>
  salt?: string
}

export default (getParams?: () => SignParmas): AxiosPlugin => {
  return {
    request(config) {
      const { params, salt } = getParams ? getParams() : {}

      let value = ''

      if (config.params) {
        value = toSortedKeyValueString({
          ...params,
          ...cloneDeep(config.params)
        })
      }

      if (config.data) {
        value += JSON.stringify(config.data)
      }

      if (salt) {
        value += salt
      }

      const XSignature = stringify({ ...params, sign: SHA256(value).toString() })
      config.headers['X-Signature'] = XSignature

      return config
    }
  }
}
