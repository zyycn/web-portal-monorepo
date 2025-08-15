import { importX } from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import { config, configs, parser } from 'typescript-eslint'

const recommended = config(
  configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  perfectionist.configs['recommended-natural'],

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
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-unexpected-multiline': 'error',
      'no-useless-escape': 'off',
      'no-var': 'error'
    }
  }
)

const typescriptRecommended = config(recommended, prettierRecommended, {
  rules: {
    'prettier/prettier': 'warn'
  }
})

export { recommended }
export default typescriptRecommended
