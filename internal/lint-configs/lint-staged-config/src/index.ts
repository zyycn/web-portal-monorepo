import type { Configuration } from 'lint-staged'

const config: Configuration = {
  '*.vue': ['prettier --cache --write', 'eslint --fix', 'stylelint --fix'],
  '*.{js,jsx,ts,tsx}': ['prettier --cache --ignore-unknown --write', 'eslint --fix'],
  '*.{scss,html,vue,css}': ['prettier --cache --ignore-unknown --write', 'stylelint --fix'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc,*.md}': ['prettier --cache --write --parser json']
}

export default config
