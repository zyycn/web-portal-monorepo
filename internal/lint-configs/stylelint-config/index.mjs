export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss', 'stylelint-config-recess-order'],
  ignoreFiles: ['node_modules/**', 'dist/**', 'public/**', '**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md'],
  overrides: [
    {
      customSyntax: 'postcss-html',
      files: ['*.html', '**/*.html']
    }
  ],
  rules: {
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'custom-property-pattern': '^_?[a-zA-Z0-9\\-]+$|^[a-zA-Z0-9\\-]+_[a-zA-Z0-9\\-]+$',
    'declaration-empty-line-before': null,
    'no-descending-specificity': null,
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'source'] }],
    'scss/dollar-variable-pattern': '^_?[a-zA-Z0-9\\-]+$',
    'selector-class-pattern': null
  }
}
