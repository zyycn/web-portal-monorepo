import type { ConfigEnv, UserConfig } from 'vite'

import { defineConfig, mergeConfig } from 'vite'

import { config as c } from './config/index'

const dc = (userConfigPromise?: (config: ConfigEnv) => Promise<UserConfig> | UserConfig) => {
  return defineConfig(async config => {
    const options = await userConfigPromise?.(config)

    return mergeConfig(options || {}, c())
  })
}

export { dc as defineConfig }
