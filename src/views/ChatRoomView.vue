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

    <!-- Messages Area -->
    <ChatMessageList
      ref="messageListRef"
      :messages="chatStore.messages"
      :current-user-id="userStore.user.uid"
    />

    <!-- Input Area -->
    <ChatInputArea :loading="chatStore.loading" :is-deal-closed="isDealClosed" @send="handleSend" />

    <!-- Rating Modal -->
    <ChatRatingModal v-model="showRatingModal" :target="ratingTarget" @submit="handleRateSubmit" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import ChatInputArea from '../components/chat/ChatInputArea.vue'
import ChatMessageList from '../components/chat/ChatMessageList.vue'
import ChatRatingModal from '../components/chat/ChatRatingModal.vue'
import { useFirestoreDoc } from '../composables/useFirestoreDoc'
import { useNotification } from '../composables/useNotification'
import { useChatStore } from '../stores/chatStore'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'
import { Chat } from '../types'
import { GROUP_STATUS } from '../utils/constants'

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
  if (!chatMeta.value || !chatMeta.value.confirmedUsers) return false
  const participants = chatMeta.value.participants || []
  const confirmed = chatMeta.value.confirmedUsers || []
  return participants.length > 0 && confirmed.length >= participants.length
})

// Watch deal closed to auto-update group status (Only Host can do this)
watch(isDealClosed, async (val) => {
  if (val && chatMeta.value && userStore.user) {
    await groupStore.updateGroupStatus(groupId, GROUP_STATUS.CLOSED)
  }
})

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
})

// Auto-scroll logic delegating to child component
const messageListRef = ref<InstanceType<typeof ChatMessageList> | null>(null)

watch(
  () => chatStore.messages,
  () => {
    nextTick(() => {
      messageListRef.value?.scrollToBottom()
    })
  },
  { deep: true }
)

const handleSend = async (text: string) => {
  if (!userStore.user) return
  try {
    await chatStore.sendMessage(text, userStore.user)
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

// --- Rating System ---
const showRatingModal = ref(false)
const ratingTarget = ref<{ uid: string; name: string; avatar: string } | null>(null)

const handleRateSubmit = async ({ score, comment }: { score: number; comment?: string }) => {
  if (!ratingTarget.value || !userStore.user) return
  try {
    await chatStore.rateUser(groupId, ratingTarget.value.uid, score, userStore.user.uid)
    notification.success(t('chat.successRate', { name: ratingTarget.value.name, score }))
    showRatingModal.value = false
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    notification.error(t('chat.errorRate', { error: message }))
  }
}
</script>
