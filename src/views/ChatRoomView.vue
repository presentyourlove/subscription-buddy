<template>
  <div
    v-if="userStore.user"
    class="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto bg-[#0f172a]"
  >
    <!-- Safety Header -->
    <div
      class="bg-amber-500/10 border-b border-amber-500/20 p-3 flex flex-col items-center justify-center text-amber-500 text-sm font-medium text-center gap-1"
    >
      <span>{{ $t('chat.safetyCredit') }}</span>
      <span>{{ $t('chat.safetyRights') }}</span>
    </div>

    <!-- Chat Header -->
    <div
      class="bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center"
    >
      <router-link
        :to="`/groups/${groupId}`"
        class="text-gray-400 hover:text-white transition-colors"
      >
        {{ $t('chat.backToDetail') }}
      </router-link>
      <div class="font-bold text-white flex flex-col items-center">
        <span>{{ $t('chat.title') }}</span>
        <span v-if="isDealClosed" class="text-xs text-green-400 mt-0.5">{{
          $t('chat.closedLabel')
        }}</span>
      </div>
      <div>
        <button
          v-if="!hasConfirmed"
          :disabled="chatStore.loading"
          class="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-1"
          @click="handleConfirm"
        >
          <span>🤝</span> {{ $t('chat.confirmDeal') }}
        </button>
        <div
          v-else
          class="text-xs text-green-500 font-medium px-3 py-1.5 border border-green-500/30 rounded-full bg-green-500/10"
        >
          {{ $t('chat.confirmed') }}
        </div>
      </div>
    </div>

    <!-- System Message: Deal Closed (Sticky Top) -->
    <div
      v-if="isDealClosed"
      class="bg-green-900/20 p-2 flex justify-center border-b border-green-500/20"
    >
      <div
        class="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1 rounded-full text-xs"
      >
        {{ $t('chat.systemClosed') }}
      </div>
    </div>

    <!-- Messages Area (Virtual Scroll) -->
    <div v-bind="containerProps" class="flex-1 p-4 scroll-smooth">
      <div v-bind="wrapperProps">
        <div
          v-for="{ data: msg } in list"
          :key="msg.id"
          class="flex mb-4"
          :class="msg.senderId === userStore.user.uid ? 'justify-end' : 'justify-start'"
        >
          <!-- Other's Avatar -->
          <div v-if="msg.senderId !== userStore.user.uid" class="mr-2 flex-shrink-0">
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
              msg.senderId === userStore.user.uid
                ? 'bg-purple-600 text-white rounded-br-none'
                : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
            "
          >
            <div v-if="msg.senderId !== userStore.user.uid" class="text-xs text-gray-500 mb-1">
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

    <!-- Input Area -->
    <div class="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
      <div v-if="isDealClosed" class="text-center text-gray-500 text-sm py-2">
        {{ $t('chat.inputClosed') }}
      </div>
      <form v-else class="flex gap-2" @submit.prevent="handleSend">
        <input
          v-model="newMessage"
          type="text"
          :placeholder="$t('chat.inputPlaceholder')"
          class="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
          :disabled="chatStore.loading"
        />
        <button
          type="submit"
          :disabled="chatStore.loading || !newMessage.trim()"
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

    <!-- Rating Modal -->
    <div
      v-if="showRatingModal"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div class="bg-[#1e293b] rounded-2xl p-6 w-full max-w-sm border border-white/10">
        <h3 class="text-lg font-bold text-white mb-4 text-center">
          {{ $t('chat.ratePartner') }}
        </h3>
        <div class="flex flex-col items-center gap-4">
          <LazyImage
            :src="ratingTarget?.avatar || 'https://via.placeholder.com/60'"
            image-class="w-16 h-16 rounded-full border-2 border-purple-500"
            container-class="w-16 h-16"
          />
          <div class="text-gray-300 font-medium">{{ ratingTarget?.name }}</div>

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
              @click="showRatingModal = false"
            >
              {{ $t('profile.edit.cancel') }}
            </button>
            <button
              class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors font-medium"
              @click="handleRate"
            >
              {{ $t('chat.submitRating', { score: ratingScore }) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import LazyImage from '../components/LazyImage.vue'
import { useFirestoreDoc } from '../composables/useFirestoreDoc'
import { useNotification } from '../composables/useNotification'
import { useChatStore } from '../stores/chatStore'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'
import { Chat } from '../types'
import { DEFAULTS, GROUP_STATUS } from '../utils/constants'

// maxRating removed
const { t } = useI18n()
const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const notification = useNotification()

const groupId = route.params.id as string

// Use composable for chat meta (confirmation status)
const { data: chatMeta } = useFirestoreDoc<Chat>('chats', groupId)

const hasConfirmed = computed(() => {
  if (!chatMeta.value || !chatMeta.value.confirmedUsers || !userStore.user) return false
  return chatMeta.value.confirmedUsers.includes(userStore.user.uid)
})

const isDealClosed = computed(() => {
  // Logic: Deal is closed if confirmed users count matches participants count
  if (!chatMeta.value || !chatMeta.value.confirmedUsers) return false
  const participants = chatMeta.value.participants || []
  const confirmed = chatMeta.value.confirmedUsers || []
  // If everyone confirmed
  return participants.length > 0 && confirmed.length >= participants.length
})

// Watch deal closed to auto-update group status (Only Host can do this)
watch(isDealClosed, async (val) => {
  if (val && chatMeta.value && userStore.user) {
    await groupStore.updateGroupStatus(groupId, GROUP_STATUS.CLOSED)
  }
})

const newMessage = ref('')

const initChat = async () => {
  if (!userStore.user) return

  // Prevent double init
  if (chatStore.unsubscribe) return

  try {
    // 1. Join Chat (ensure participant)
    await chatStore.joinChat(groupId, userStore.user)
    // 2. Subscribe messages
    chatStore.subscribeToMessages(groupId)
    // Note: Chat meta is now handled by useFirestoreDoc composable
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    notification.error(t('chat.errorJoin', { error: message }))
  }
}

onMounted(() => {
  initChat()
})

// Watch for auth ready if page refreshed
watch(
  () => userStore.user,
  (val) => {
    if (val) initChat()
  }
)

onUnmounted(() => {
  chatStore.unsubscribeFromMessages()
  // Note: chatMeta unsubscription is handled by useFirestoreDoc composable
})

// Virtual Scroll Logic

// Virtual Scroll Logic
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  computed(() => chatStore.messages),
  {
    itemHeight: 80, // Estimated height as requested
    overscan: 10
  }
)

// Auto-scroll logic
const scrollToBottom = () => {
  if (chatStore.messages.length > 0) {
    scrollTo(chatStore.messages.length - 1)
  }
}

// Watch messages to auto scroll
watch(
  () => chatStore.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true }
)

const handleSend = async () => {
  if (!newMessage.value.trim()) return
  if (!userStore.user) return
  try {
    await chatStore.sendMessage(newMessage.value, userStore.user)
    newMessage.value = ''
  } catch (err: unknown) {
    notification.error(t('chat.errorSend', { error: (err as Error).message }))
  }
}

const handleConfirm = async () => {
  if (!confirm(t('chat.confirmDealPrompt'))) return
  if (!userStore.user) return
  try {
    await chatStore.confirmDeal(groupId, userStore.user)
  } catch (err: unknown) {
    notification.error(t('chat.errorConfirm', { error: (err as Error).message }))
  }
}

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

// --- Rating System ---
const showRatingModal = ref(false)
const ratingTarget = ref<{ uid: string; name: string; avatar: string } | null>(null) // { uid, name, avatar }
const ratingScore = ref<number>(DEFAULTS.MAX_RATING) // Use constant
const ratingComment = ref('')

// Unused logic removed for cleanup
// const maxRating = ...
// const participantsInfo = ...
// const setRating = ...
// const checkRated = ...

const handleRate = async () => {
  if (!ratingTarget.value || !userStore.user) return
  try {
    await chatStore.rateUser(groupId, ratingTarget.value.uid, ratingScore.value, userStore.user.uid)
    notification.success(
      t('chat.successRate', { name: ratingTarget.value.name, score: ratingScore.value })
    )
    showRatingModal.value = false
    ratingComment.value = '' // Reset
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    notification.error(t('chat.errorRate', { error: message }))
  }
}
</script>
