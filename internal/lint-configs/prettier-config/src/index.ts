import type { Config } from 'prettier'

const config: Config = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 160,
  proseWrap: 'never',
  semi: false,
  singleQuote: true,
  trailingComma: 'none'
}

export default config
