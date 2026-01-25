<template>
  <div
    v-if="!accepted"
    class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10 p-4 md:p-6 z-50 animate-fade-up"
  >
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="text-gray-300 text-sm md:text-base text-center md:text-left">
        <p>🍪 我們使用 Cookie 來確保您獲得最佳的使用體驗。繼續瀏覽即表示您同意我們使用 Cookie。</p>
      </div>
      <div class="flex gap-3">
        <button
          class="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-medium transition-colors text-sm"
          @click="accept"
        >
          我同意
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const accepted = ref(true) // Default to true to prevent flash, check in onMounted

onMounted(() => {
  const isAccepted = localStorage.getItem('cookie_consent') // NOSONAR
  if (!isAccepted) {
    accepted.value = false
  }
})

const accept = () => {
  localStorage.setItem('cookie_consent', 'true') // NOSONAR
  accepted.value = true
}
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.5s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
