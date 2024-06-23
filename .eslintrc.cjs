require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: ['prettier', 'vue', '@typescript-eslint', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/max-attributes-per-line': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    'no-sparse-arrays': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'import/order': ['error', { 'newlines-between': 'always' }],
    'no-duplicate-imports': 'error',
  },
};
