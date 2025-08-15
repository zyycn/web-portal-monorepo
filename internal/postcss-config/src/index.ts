import { findIndex } from 'es-toolkit/compat'
import { sep } from 'node:path'
import presetEnv from 'postcss-preset-env'
import pxtorem from 'postcss-pxtorem'

interface defineConfigOptions {
  adaptivePages?: string[]
}

const defineConfig = (options: defineConfigOptions = {}) => {
  const { adaptivePages = [] } = options

  return {
    plugins: [
      presetEnv(),
      pxtorem({
        exclude: (file: string) => {
          const filePath = file.split(sep).join('/')
          return findIndex(adaptivePages, (page: string) => filePath.includes(page)) === -1
        },
        minPixelValue: 0,
        propList: ['*'],
        rootValue: 16,
        selectorBlackList: ['ignore-', 'html']
      })
    ]
  }
}

export { defineConfig }
