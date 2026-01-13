<template>
  <div
    class="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-purple-500 selection:text-white"
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
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CookieConsent from './components/CookieConsent.vue'
import { useUserStore } from './stores/userStore'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.initAuth()
})
</script>
