<template>
  <button
    v-bind="$attrs"
    :disabled="loading || ($attrs.disabled as boolean | undefined)"
    class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    <slot name="icon"></slot>
    <span v-if="loading">處理中...</span>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
