module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['mixin', 'include', 'extend'] },
    ],
    'function-no-unknown': [true, { ignoreFunctions: ['theme'] }],
    'custom-property-empty-line-before': null,
    'selector-class-pattern': null,
    'value-keyword-case': null,
    'no-invalid-position-at-import-rule': null,
    'max-line-length': null,
  },
}
