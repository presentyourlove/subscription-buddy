// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-vuefire',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],
  css: [
    '~/assets/style.css'
  ],
  i18n: {
    lazy: true,
    langDir: 'locales',
    locales: [
      { code: 'en-US', file: 'en-US.json', name: 'English' },
      { code: 'zh-TW', file: 'zh-TW.json', name: '繁體中文' }
    ],
    defaultLocale: 'zh-TW',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  vuefire: {
    config: {
      // Firebase config will be injected via environment variables
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
    },
    auth: {
      enabled: true,
      sessionCookie: true
    }
  },
  pinia: {
    storesDirs: ['./stores/**']
  },
  app: {
    head: {
      title: 'Subscription Buddy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ]
    }
  },
  // SSG Configuration
  // nitro: {
  //   preset: 'firebase'
  // }
})
