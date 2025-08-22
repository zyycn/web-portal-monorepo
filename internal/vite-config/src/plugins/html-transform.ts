import type { Plugin, ResolvedConfig } from 'vite'

import { loadEnv } from 'vite'

interface HtmlTransformOptions {
  /**
   * 环境变量前缀，默认为 'VITE_'
   */
  envPrefix?: string | string[]

  /**
   * 是否启用详细日志
   */
  verbose?: boolean
}

const htmlTransform = (options: HtmlTransformOptions = {}): Plugin => {
  const { envPrefix = 'VITE_', verbose = false } = options

  let config: ResolvedConfig
  let env: Record<string, string> = {}

  return {
    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig
      // 加载环境变量
      env = loadEnv(config.mode, config.envDir || process.cwd(), envPrefix)

      if (verbose) {
        console.log('已加载环境变量:', Object.keys(env))
      }
    },

    name: 'html-transform',

    transformIndexHtml(html: string) {
      // 匹配 <%= ANY_VARIABLE %> 格式的占位符
      const regex = /<%=(\s*[\w_]+\s*)%>/g
      let transformedHtml = html
      let hasReplacements = false

      // 查找并替换所有匹配的占位符
      transformedHtml = html.replace(regex, (match, variableName) => {
        const key = variableName.trim()

        if (env[key] !== undefined) {
          hasReplacements = true
          if (verbose) {
            console.log(`替换环境变量: ${key} = ${env[key]}`)
          }
          return env[key]
        } else {
          // 如果环境变量不存在，保留原占位符并发出警告
          console.warn(`环境变量未找到: ${key}`)
          return match
        }
      })

      if (verbose && hasReplacements) {
        console.log('HTML 环境变量替换完成')
      }

      return transformedHtml
    }
  }
}

export { htmlTransform }
