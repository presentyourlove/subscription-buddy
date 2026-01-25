<template>
  <div v-bind="containerProps" class="flex-1 p-4 scroll-smooth">
    <div v-bind="wrapperProps">
      <div
        v-for="{ data: msg } in list"
        :key="msg.id"
        class="flex mb-4"
        :class="msg.senderId === currentUserId ? 'justify-end' : 'justify-start'"
      >
        <!-- Other's Avatar -->
        <div v-if="msg.senderId !== currentUserId" class="mr-2 flex-shrink-0">
          <LazyImage
            :src="msg.senderAvatar || 'https://via.placeholder.com/40'"
            image-class="w-8 h-8 rounded-full border border-white/20"
            container-class="w-8 h-8"
          />
        </div>

        <!-- Bubble -->
        <div
          class="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
          :class="
            msg.senderId === currentUserId
              ? 'bg-purple-600 text-white rounded-br-none'
              : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
          "
        >
          <div v-if="msg.senderId !== currentUserId" class="text-xs text-gray-500 mb-1">
            {{ msg.senderName }}
          </div>
          {{ msg.text }}
          <div class="text-[10px] opacity-50 text-right mt-1">
            {{ formatTime(msg.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'
import { computed, nextTick, watch } from 'vue'

import type { Message } from '../../types'
import LazyImage from '../LazyImage.vue'

const props = defineProps<{
  messages: Message[]
  currentUserId: string
}>()

// Virtual Scroll Logic
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  computed(() => props.messages),
  {
    itemHeight: 80, // Estimated height
    overscan: 10
  }
)

// Auto-scroll logic
const scrollToBottom = () => {
  if (props.messages.length > 0) {
    scrollTo(props.messages.length - 1)
  }
}

// Watch messages to auto scroll
watch(
  () => props.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true }
)

const formatTime = (timestamp: Date | { seconds: number } | null | undefined) => {
  if (!timestamp) return '...'
  if (timestamp instanceof Date)
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  if ('seconds' in timestamp)
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  return '...'
}

defineExpose({
  scrollToBottom
})
</script>
