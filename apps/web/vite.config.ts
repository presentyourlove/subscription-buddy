/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
const ICON_512 = 'pwa-512x512.png'

export default defineConfig({
  base: './', // Support deployment to sub-paths
  build: {
    chunkSizeWarningLimit: 300, // KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
            if (id.includes('vue')) {
              return 'vendor-vue'
            }
            return 'vendor'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@subscription-buddy/core': '/../../packages/core/src'
    }
  },
  plugins: [
    vue(),
    Components({
      dts: 'src/components.d.ts'
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192x192.webp', ICON_512],
      manifest: {
        name: 'Subscription Buddy - 合購夥伴',
        short_name: 'SubBuddy',
        description: '尋找串流媒體合購夥伴的媒合平台',
        theme_color: '#7c3aed',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: ICON_512,
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: ICON_512,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 3000000, // 3MB limit for precaching
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-api',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              }
            }
          },
          {
            urlPattern: /^http.*/i,
            method: 'POST',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'background-sync-queue',
                options: {
                  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
                }
              }
            }
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', 'tests/e2e/**'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      },
      include: ['src/composables/**/*.ts', 'src/services/**/*.ts'], // Focus on logic
      exclude: ['src/**/*.d.ts', 'src/main.ts']
    }
  }
})
