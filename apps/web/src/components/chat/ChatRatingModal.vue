<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div class="bg-[#1e293b] rounded-2xl p-6 w-full max-w-sm border border-white/10">
      <h3 class="text-lg font-bold text-white mb-4 text-center">
        {{ $t('chat.ratePartner') }}
      </h3>
      <div class="flex flex-col items-center gap-4">
        <LazyImage
          :src="target?.avatar || 'https://via.placeholder.com/60'"
          image-class="w-16 h-16 rounded-full border-2 border-purple-500"
          container-class="w-16 h-16"
        />
        <div class="text-gray-300 font-medium">{{ target?.name }}</div>

        <div class="flex gap-2">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="text-2xl transition-transform hover:scale-110"
            :class="star <= ratingScore ? 'text-yellow-400' : 'text-gray-600'"
            @click="ratingScore = star"
          >
            ★
          </button>
        </div>

        <textarea
          v-model="ratingComment"
          :placeholder="$t('chat.ratingPlaceholder')"
          rows="3"
          class="w-full bg-black/20 rounded-lg p-3 text-sm text-white border border-white/10 focus:border-purple-500 outline-none resize-none"
        ></textarea>

        <div class="flex gap-2 w-full mt-2">
          <button
            class="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
            @click="close"
          >
            {{ $t('profile.edit.cancel') }}
          </button>
          <button
            class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors font-medium"
            @click="submit"
          >
            {{ $t('chat.submitRating', { score: ratingScore }) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import LazyImage from '../LazyImage.vue'

const props = defineProps<{
  modelValue: boolean
  target: { uid: string; name: string; avatar: string } | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: { score: number; comment: string }): void
}>()

const ratingScore = ref(5)
const ratingComment = ref('')

const close = () => {
  emit('update:modelValue', false)
  // Reset fields on close? Or keep them? Usually reset is better UX if creating new, but here it's a modal.
  // Let's reset for safety.
  ratingScore.value = 5
  ratingComment.value = ''
}

const submit = () => {
  emit('submit', { score: ratingScore.value, comment: ratingComment.value })
  // Don't close here, wait for parent to handle success and close
}
</script>
