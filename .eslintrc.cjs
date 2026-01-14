/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['*.vue.js', '*.vue.js.map', 'dist/**', 'node_modules/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'error'
  },
  overrides: [
    {
      files: ['public/firebase-messaging-sw.js'],
      env: {
        serviceworker: true
      },
      globals: {
        firebase: 'readonly',
        importScripts: 'readonly'
      }
    }
  ]
}
