import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

// 只建立實例，不預先載入語系
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'zh-TW',
  fallbackLocale: 'zh-TW',
  messages: {} // 動態載入
})

export async function loadLocaleMessages(locale: string) {
  // 檢查是否已載入
  if (i18n.global.availableLocales.includes(locale)) {
    return
  }

  // 動態 import
  let messages
  try {
    messages = await import(`./locales/${locale}.json`)
  } catch (e) {
    console.error(`Failed to load locale: ${locale}`, e)
    return
  }

  // 設定語系資料
  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}

export async function setLocale(locale: string) {
  await loadLocaleMessages(locale)
  i18n.global.locale.value = locale
  document.querySelector('html')?.setAttribute('lang', locale)
  localStorage.setItem('user-locale', locale)
}

export default i18n
