<template>
  <div class="max-w-4xl mx-auto px-4 py-12 text-gray-300">
    <h1 class="text-3xl font-bold text-white mb-8">{{ title }}</h1>

    <div class="space-y-6">
      <slot></slot>

      <div class="pt-8 text-center">
        <router-link to="/" class="text-purple-400 hover:text-purple-300 transition-colors">
          ← {{ $t('app.backToHome') || '返回首頁' }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
