<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed bottom-0 right-0 m-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-[100] max-w-sm flex flex-col gap-3"
    role="alert"
  >
    <div class="message text-sm text-gray-600 dark:text-gray-300">
      <span v-if="offlineReady">
        {{ $t('pwa.offlineReady') }}
      </span>
      <span v-else>
        {{ $t('pwa.updateAvailable') }}
      </span>
    </div>
    <div class="flex gap-2">
      <button
        v-if="needRefresh"
        class="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
        @click="updateServiceWorker()"
      >
        {{ $t('common.refresh') }}
      </button>
      <button
        class="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        @click="close"
      >
        {{ $t('common.close') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

// Replaced updateServiceWorker with proper handling
// offlineReady: boolean, needRefresh: boolean, updateServiceWorker: function
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>
