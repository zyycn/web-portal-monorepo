import type { ConfigEnv, UserConfig } from 'vite'

import { defineConfig, mergeConfig } from 'vite'

import { commonConfig } from './common'

const defineCustomConfig = (userConfigPromise?: (config: ConfigEnv) => Promise<UserConfig> | UserConfig) => {
  return defineConfig(async config => {
    const options = await userConfigPromise?.(config)

    return mergeConfig(options || {}, {
      ...commonConfig()
    })
  })
}

export { defineCustomConfig as defineConfig }
