import { setAnalyticsCollectionEnabled } from 'firebase/analytics'
import { onMounted, ref } from 'vue'

import { analytics } from '../firebase/config'

const STORAGE_KEY = 'cookie_consent_status'
type ConsentStatus = 'granted' | 'denied' | null

export function useCookieConsent() {
  const status = ref<ConsentStatus>(null)
  const isVisible = ref(false)

  // Initialize consent status
  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus
    status.value = stored

    if (stored === 'granted') {
      enableAnalytics()
    } else {
      // Default is opt-out (GDPR compliant)
      // If null (first visit) or denied, ensure it's disabled
      disableAnalytics()

      // Show banner if never interacted
      if (stored === null) {
        isVisible.value = true
      }
    }
  }

  const enableAnalytics = () => {
    if (analytics) {
      setAnalyticsCollectionEnabled(analytics, true)
      // console.log('[CookieConsent] Analytics Enabled')
    }
  }

  const disableAnalytics = () => {
    if (analytics) {
      setAnalyticsCollectionEnabled(analytics, false)
      // console.log('[CookieConsent] Analytics Disabled')
    }
  }

  const grantConsent = () => {
    status.value = 'granted'
    localStorage.setItem(STORAGE_KEY, 'granted')
    enableAnalytics()
    isVisible.value = false
  }

  const denyConsent = () => {
    status.value = 'denied'
    localStorage.setItem(STORAGE_KEY, 'denied')
    disableAnalytics()
    isVisible.value = false
  }

  onMounted(() => {
    init()
  })

  return {
    status,
    isVisible,
    grantConsent,
    denyConsent
  }
}
