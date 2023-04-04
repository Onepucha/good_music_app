module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-recommended-vue/scss',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['mixin', 'include', 'extend'] },
    ],
    'custom-property-empty-line-before': null,
    'selector-class-pattern': null,
    'value-keyword-case': null,
    'no-invalid-position-at-import-rule': null,
    'max-line-length': null,
    'function-no-unknown': null,
    'no-descending-specificity': null,
    'function-url-quotes': null,
    'string-quotes': 'single',
  },
}
