/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import Components from 'unplugin-vue-components/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
// https://vitejs.dev/config/
export default defineConfig({
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
            includeAssets: ['favicon.ico', 'pwa-192x192.webp', 'pwa-512x512.png'],
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
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
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
                    }
                ]
            }
        })
    ],
    base: './', // Support deployment to sub-paths
    test: {
        environment: 'jsdom',
        exclude: ['**/node_modules/**', 'tests/e2e/**'],
        globals: true
    }
});
