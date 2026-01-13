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

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
      <!-- System Message: Deal Closed -->
      <div v-if="isDealClosed" class="flex justify-center my-4">
        <div
          class="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs"
        >
          {{ $t('chat.systemClosed') }}
        </div>
      </div>

      <div
        v-for="msg in chatStore.messages"
        :key="msg.id"
        class="flex"
        :class="msg.senderId === userStore.user.uid ? 'justify-end' : 'justify-start'"
      >
        <!-- Other's Avatar -->
        <div v-if="msg.senderId !== userStore.user.uid" class="mr-2 flex-shrink-0">
          <img
            :src="msg.senderAvatar || 'https://via.placeholder.com/40'"
            class="w-8 h-8 rounded-full border border-white/20"
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

    <!-- Input Area -->
    <div class="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
      <!-- ... input form ... -->
      <form class="flex gap-2" @submit.prevent="handleSend">
        <input
          v-model="newMessage"
          type="text"
          :disabled="isDealClosed"
          class="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :placeholder="isDealClosed ? $t('chat.inputClosed') : $t('chat.inputPlaceholder')"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim() || isDealClosed"
          class="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          ➤
        </button>
      </form>

      <!-- Rating Trigger (Only when closed) -->
      <div v-if="isDealClosed" class="mt-4 flex justify-center">
        <button
          class="text-sm text-purple-400 hover:text-purple-300 underline"
          @click="showRatingModal = true"
        >
          {{ $t('chat.ratePartner') }}
        </button>
      </div>
    </div>

    <!-- Rating Modal -->
    <div
      v-if="showRatingModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
        <button class="absolute top-4 right-4 text-gray-400" @click="showRatingModal = false">
          ✕
        </button>
        <h3 class="text-xl font-bold text-white mb-4 text-center">
          {{ $t('chat.ratingTitle') }}
        </h3>

        <div class="space-y-4 max-h-[60vh] overflow-y-auto">
          <div v-for="p in participantsInfo" :key="p.uid" class="bg-white/5 p-4 rounded-xl">
            <div class="flex items-center gap-3 mb-3">
              <img
                :src="p.avatar || 'https://via.placeholder.com/40'"
                class="w-10 h-10 rounded-full"
              />
              <span class="text-white font-medium">{{ p.name }}</span>
            </div>

            <div v-if="checkRated(p.uid)" class="text-xs text-green-400 text-center py-2">
              {{ $t('chat.rated') }}
            </div>
            <div v-else>
              <div class="flex justify-center gap-2 mb-3">
                <button
                  v-for="n in maxRating"
                  :key="n"
                  class="text-2xl transition-transform hover:scale-110"
                  :class="
                    (ratingTarget?.uid === p.uid ? ratingScore : 0) >= n
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  "
                  @click="setRating(n, p)"
                >
                  ★
                </button>
              </div>
              <BaseTextarea
                v-if="ratingTarget?.uid === p.uid"
                v-model="ratingComment"
                :placeholder="$t('chat.ratingPlaceholder')"
                class="mb-2"
              />
              <BaseButton
                v-if="ratingTarget?.uid === p.uid"
                :disabled="!ratingComment.trim()"
                @click="handleRate"
              >
                {{ $t('chat.submitRating', { score: ratingScore }) }}
              </BaseButton>
            </div>
          </div>
          <div v-if="participantsInfo.length === 0" class="text-center text-gray-500 py-4">
            {{ $t('chat.noTarget') }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-screen flex items-center justify-center text-gray-400">
    {{ $t('chat.loginRequired') }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n' // Import useI18n
import { useChatStore } from '../stores/chatStore'
import { useUserStore } from '../stores/userStore'
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { db } from '../firebase/config'

import { useGroupStore } from '../stores/groupStore'
import BaseButton from '../components/BaseButton.vue'
import BaseTextarea from '../components/BaseTextarea.vue'
import { GROUP_STATUS, DEFAULTS } from '../utils/constants' // Import DEFAULTS

const maxRating = DEFAULTS.MAX_RATING

const { t } = useI18n() // Use i18n
const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()
const groupStore = useGroupStore()

const groupId = route.params.id as string
// Extra state for chat document (to watch confirmedUsers)
const chatMeta = ref<any>(null)
let metaUnsubscribe: Unsubscribe | null = null

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
const messagesContainer = ref(null)

const initChat = async () => {
  if (!userStore.user) return

  // Prevent double init
  if (chatStore.unsubscribe) return

  try {
    // 1. Join Chat (ensure participant)
    await chatStore.joinChat(groupId, userStore.user)
    // 2. Subscribe messages
    chatStore.subscribeToMessages(groupId)

    // 3. Subscribe to Chat Meta (for confirmation status)
    if (!metaUnsubscribe) {
      metaUnsubscribe = onSnapshot(doc(db, 'chats', groupId), (doc) => {
        chatMeta.value = doc.data()
      })
    }
  } catch (err) {
    alert(t('chat.errorJoin', { error: err.message }))
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
  if (metaUnsubscribe) metaUnsubscribe()
})

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
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
  try {
    await chatStore.sendMessage(newMessage.value, userStore.user)
    newMessage.value = ''
  } catch (err) {
    alert(t('chat.errorSend', { error: err.message }))
  }
}

const handleConfirm = async () => {
  if (!confirm(t('chat.confirmDealPrompt'))) return
  try {
    await chatStore.confirmDeal(groupId, userStore.user)
  } catch (err) {
    alert(t('chat.errorConfirm', { error: err.message }))
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return '...'
  return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// --- Rating System ---
const showRatingModal = ref(false)
const ratingTarget = ref<{ uid: string; name: string; avatar: string } | null>(null) // { uid, name, avatar }
const ratingScore = ref(DEFAULTS.MAX_RATING) // Use constant
const ratingComment = ref('')

const participantsInfo = computed(() => {
  // We need complete info (name, avatar) for participants.
  // Ideally userStore or chatStore should provide this.
  // Strategy: Extract unique senders from message history as a MVP solution for participant info.

  if (!chatStore.messages) return []
  const senders: Record<string, { uid: string; name: string; avatar: string }> = {}
  chatStore.messages.forEach((m) => {
    if (m.senderId !== userStore.user?.uid) {
      senders[m.senderId] = {
        uid: m.senderId,
        name: m.senderName,
        avatar: m.senderAvatar
      }
    }
  })
  return Object.values(senders)
})

const setRating = (score: number, target: any) => {
  ratingScore.value = score
  ratingTarget.value = target
}

const handleRate = async () => {
  if (!ratingTarget.value || !userStore.user) return
  try {
    await chatStore.rateUser(
      groupId,
      ratingTarget.value.uid,
      ratingScore.value,
      ratingComment.value,
      userStore.user.uid
    )
    alert(t('chat.successRate', { name: ratingTarget.value.name, score: ratingScore.value }))
    showRatingModal.value = false
    ratingComment.value = '' // Reset
    // Refresh meta logic? onSnapshot handles it.
  } catch (err) {
    alert(t('chat.errorRate', { error: err }))
  }
}

const checkRated = (targetUid: string) => {
  if (!chatMeta.value || !chatMeta.value.ratings || !userStore.user) return false
  const myRatings = chatMeta.value.ratings[userStore.user.uid]
  return myRatings && myRatings[targetUid] !== undefined
}
</script>
