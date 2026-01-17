<template>
  <div class="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
    <div v-if="isDealClosed" class="text-center text-gray-500 text-sm py-2">
      {{ $t('chat.inputClosed') }}
    </div>
    <form v-else class="flex gap-2" @submit.prevent="handleSubmit">
      <input
        v-model="newMessage"
        type="text"
        :placeholder="$t('chat.inputPlaceholder')"
        class="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
        :disabled="loading"
      />
      <button
        type="submit"
        :disabled="loading || !newMessage.trim()"
        class="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
          />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  loading?: boolean
  isDealClosed?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', text: string): void
}>()

const newMessage = ref('')

const handleSubmit = () => {
  if (!newMessage.value.trim() || props.loading) return
  emit('send', newMessage.value)
  newMessage.value = ''
}
</script>
