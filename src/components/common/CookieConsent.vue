<template>
  <div
    v-if="isVisible"
    class="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 shadow-2xl p-4 md:p-6 transition-transform duration-300 ease-in-out transform"
    role="dialog"
    aria-labelledby="cookie-consent-title"
    aria-describedby="cookie-consent-desc"
  >
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex-1">
        <h3 id="cookie-consent-title" class="text-lg font-semibold text-white mb-1">
          🍪 我們重視您的隱私
        </h3>
        <p id="cookie-consent-desc" class="text-gray-300 text-sm md:text-base">
          本網站使用 Cookies 與 Firebase Analytics 來優化您的瀏覽體驗並分析網站流量。
          除非您點擊「接受」，否則我們不會啟用追蹤功能。
          <a href="#" class="text-primary-400 hover:text-primary-300 underline" @click.prevent>了解更多</a>
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <button
          @click="denyConsent"
          class="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          拒絕
        </button>
        <button
          @click="grantConsent"
          class="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg transition-colors"
        >
          接受所有
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCookieConsent } from '../../composables/useCookieConsent'

const { isVisible, grantConsent, denyConsent } = useCookieConsent()
</script>

<style scoped>
/* Ensure high z-index and proper stacking context */
</style>
