/**
 * 支持四种配置方式：
 * 1. 使用默认所有规则
 * 2. 仅启用特定规则（按规则名称）
 * 3. 覆盖特定文件类型的处理规则
 * 4. 完全自定义配置
 *
 * 使用示例：
 * // 方式1: 使用所有默认规则
 * export default defineConfig();
 *
 * // 方式2: 只启用特定规则（按规则名称）
 * export default defineConfig({ enabledRules: ['vue'] });
 *
 * // 方式3: 覆盖部分配置（保留未覆盖的默认配置）
 * export default defineConfig({
 *   overrides: {
 *     '*.ts': ['eslint --fix']
 *   }
 * });
 *
 * // 方式4: 完全自定义配置（忽略所有默认规则）
 * export default defineConfig({
 *   customConfig: {
 *     '*.js': ['eslint --fix'],
 *     '*.css': ['stylelint --fix']
 *   }
 * });
 */

// 规则定义集 - 每个规则独立配置
const RULE_SET = {
  javascript: {
    commands: ['prettier --cache --ignore-unknown --write', 'eslint --fix'],
    pattern: '*.{js,jsx,ts,tsx}'
  },
  json: {
    commands: ['prettier --cache --write --parser json'],
    pattern: '{!(package)*.json,*.code-snippets,.!(browserslist)*rc,*.md}'
  },
  styles: {
    commands: ['prettier --cache --ignore-unknown --write', 'stylelint --fix'],
    pattern: '*.{scss,html,vue,css}'
  },
  vue: {
    commands: ['prettier --cache --write', 'eslint --fix', 'stylelint --fix'],
    pattern: '*.vue'
  }
}

// 默认启用所有规则
const DEFAULT_ENABLED_RULES = Object.keys(RULE_SET) as (keyof typeof RULE_SET)[]

interface defineConfigOptions {
  customConfig?: import('lint-staged').Configuration
  enabledRules?: RuleName[]
  overrides?: Partial<Record<RuleName, string[]>>
}

type RuleName = keyof typeof RULE_SET

/**
 * 创建可定制的 lint-staged 配置
 * @param options 配置选项
 */
export function defineConfig(options: defineConfigOptions = {}): import('lint-staged').Configuration {
  if (options.customConfig) {
    return options.customConfig
  }

  const enabledRules = options.enabledRules || DEFAULT_ENABLED_RULES

  const baseConfig: import('lint-staged').Configuration = {}

  enabledRules.forEach(ruleName => {
    const rule = RULE_SET[ruleName]

    baseConfig[rule.pattern] = options.overrides?.[ruleName] || rule.commands
  })

  return baseConfig
}

export default defineConfig()
