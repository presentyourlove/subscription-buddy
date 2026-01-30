<template>
  <div
    class="min-h-screen bg-brand-dark text-white font-sans selection:bg-purple-500 selection:text-white pb-safe"
  >
    <Navbar />
    <main v-if="userStore.authReady">
      <NuxtPage />
    </main>
    <div v-else class="h-screen flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
      ></div>
    </div>
    <CommonCookieConsent />
    <!-- <ReloadPrompt /> -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Nuxt auto-imports components, but explicit imports can help with complex paths if auto-import fails
// Assuming standard Nuxt auto-import for top-level components
// Navbar, Footer, ReloadPrompt are likely top-level in components/
// CookieConsent is in components/common/

import { useUserStore } from '~/stores/userStore'

const userStore = useUserStore()

onMounted(() => {
  userStore.initAuth()
})
</script>
