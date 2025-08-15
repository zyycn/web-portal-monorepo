import prettierRecommended from 'eslint-plugin-prettier/recommended'
import vue from 'eslint-plugin-vue'
import { config } from 'typescript-eslint'
import parser from 'vue-eslint-parser'

import { recommended as tsRecommended } from '../ts/index'

export default config(
  tsRecommended,
  vue.configs['flat/recommended'],
  prettierRecommended,

  {
    files: ['**/*.{vue}'],
    languageOptions: {
      parser
    },
    rules: {
      'prettier/prettier': 'warn',

      'vue/multi-word-component-names': 'off', // 禁用多单词组件名
      'vue/no-mutating-props': 'off'
    }
  }
)
