import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import { config, parser } from 'typescript-eslint'

import localTsConfig from '../ts/index'

export default config(
  localTsConfig,
  ...eslintPluginVue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,

  { ignores: ['*.d.ts', '**/dist'] },

  {
    files: ['**/*.{vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        parser
      },
      sourceType: 'module'
    },
    rules: {
      'vue/multi-word-component-names': 'off', // 禁用多单词组件名
      'vue/no-mutating-props': 'off'
    }
  }
)
