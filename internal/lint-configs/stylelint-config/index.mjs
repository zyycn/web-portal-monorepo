export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss', 'stylelint-config-recess-order'],
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md'],
  overrides: [
    {
      customSyntax: 'postcss-html',
      files: ['*.html', '**/*.html']
    }
  ],
  rules: {
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'source'] }]
  }
}
