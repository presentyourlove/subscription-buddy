/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
    'plugin:sonarjs/recommended'
  ],
  plugins: ['simple-import-sort'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['*.vue.js', '*.vue.js.map', 'dist/**', 'node_modules/**', 'src/components.d.ts'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'error',
    'sonarjs/cognitive-complexity': ['error', 15]
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
    },
    {
      files: ['functions/src/**/*.ts'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            semi: false,
            tabWidth: 4,
            trailingComma: 'none',
            useTabs: false
          }
        ]
      }
    }
  ]
}
