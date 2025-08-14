import { importX } from 'eslint-plugin-import-x'
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import { config, configs } from 'typescript-eslint'

export default config(
  configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintPluginPerfectionist.configs['recommended-natural'],

  { ignores: ['*.d.ts', '**/dist'] },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      sourceType: 'module'
    },
    plugins: {
      unicorn: eslintPluginUnicorn
    },
    rules: {
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-unexpected-multiline': 'error',
      'no-useless-escape': 'off',
      'no-var': 'error'
    }
  }
)
