<template>
  <div
    class="min-h-screen bg-brand-dark text-white font-sans selection:bg-purple-500 selection:text-white pb-safe"
  >
    <Navbar />
    <main v-if="userStore.authReady">
      <router-view />
    </main>
    <div v-else class="h-screen flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
      ></div>
    </div>
    <CookieConsent />
    <ReloadPrompt />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import CookieConsent from './components/CookieConsent.vue'
import Footer from './components/Footer.vue'
import Navbar from './components/Navbar.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

onMounted(() => {
  userStore.initAuth()
})
</script>
