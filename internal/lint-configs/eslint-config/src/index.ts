import { importX } from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import unicorn from 'eslint-plugin-unicorn'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import { config, configs, parser } from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default config(
  configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  perfectionist.configs['recommended-natural'],
  vue.configs['flat/recommended'],
  prettierRecommended,

  { ignores: ['*.d.ts', '**/dist'] },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        parser
      },
      sourceType: 'module'
    },
    plugins: {
      unicorn
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',

      'import-x/no-unresolved': 'off', // https://github.com/un-ts/eslint-plugin-import-x/issues/92

      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-unexpected-multiline': 'error',
      'no-useless-escape': 'off',
      'no-var': 'error',

      'prettier/prettier': 'warn'
    }
  },

  {
    files: ['**/*.{vue}'],
    languageOptions: {
      parser: vueParser
    },
    rules: {
      'vue/multi-word-component-names': 'off', // 禁用多单词组件名
      'vue/no-mutating-props': 'off'
    }
  }
)
