/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Support deployment to sub-paths
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', 'tests/e2e/**'],
    globals: true
  }
})
