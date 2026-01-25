import { createI18n } from 'vue-i18n'

import enUS from './locales/en-US.json'
import zhTW from './locales/zh-TW.json'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'zh-TW',
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTW,
    'en-US': enUS
  }
})

export default i18n
