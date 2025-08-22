import { findIndex } from 'es-toolkit/compat'
import { sep } from 'node:path'
import presetEnv from 'postcss-preset-env'
import pxtorem from 'postcss-pxtorem'

interface defineConfigOptions {
  adaptive?: string[]
}

const defineConfig = (options: defineConfigOptions = {}) => {
  const { adaptive = [] } = options

  return {
    plugins: [
      pxtorem({
        exclude: (file: string) => {
          const filePath = file.split(sep).join('/')
          return findIndex(adaptive, (page: string) => filePath.includes(page)) === -1
        },
        minPixelValue: 0,
        propList: ['*'],
        rootValue: 16,
        selectorBlackList: ['ignore-', 'html']
      }),
      presetEnv({
        stage: 3
      })
    ]
  }
}

export { defineConfig }
