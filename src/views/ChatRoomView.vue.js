import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n' // Import useI18n
import { useChatStore } from '../stores/chatStore'
import { useUserStore } from '../stores/userStore'
import { doc, onSnapshot } from 'firebase/firestore'
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
const groupId = route.params.id
// Extra state for chat document (to watch confirmedUsers)
const chatMeta = ref(null)
let metaUnsubscribe = null
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
const ratingTarget = ref(null) // { uid, name, avatar }
const ratingScore = ref(DEFAULTS.MAX_RATING) // Use constant
const ratingComment = ref('')
const participantsInfo = computed(() => {
  // We need complete info (name, avatar) for participants.
  // Ideally userStore or chatStore should provide this.
  // Strategy: Extract unique senders from message history as a MVP solution for participant info.
  if (!chatStore.messages) return []
  const senders = {}
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
const setRating = (score, target) => {
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
const checkRated = (targetUid) => {
  if (!chatMeta.value || !chatMeta.value.ratings || !userStore.user) return false
  const myRatings = chatMeta.value.ratings[userStore.user.uid]
  return myRatings && myRatings[targetUid] !== undefined
}
const __VLS_ctx = {
  ...{},
  ...{}
}
let __VLS_components
let __VLS_intrinsics
let __VLS_directives
if (__VLS_ctx.userStore.user) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto bg-[#0f172a]' }
  })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-col']} */ /** @type {__VLS_StyleScopedClasses['h-[calc(100vh-64px)]']} */ /** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['bg-[#0f172a]']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{
      class:
        'bg-amber-500/10 border-b border-amber-500/20 p-3 flex flex-col items-center justify-center text-amber-500 text-sm font-medium text-center gap-1'
    }
  })
  /** @type {__VLS_StyleScopedClasses['bg-amber-500/10']} */ /** @type {__VLS_StyleScopedClasses['border-b']} */ /** @type {__VLS_StyleScopedClasses['border-amber-500/20']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-col']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['text-amber-500']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['gap-1']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({})
  __VLS_ctx.$t('chat.safetyCredit')
  __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({})
  __VLS_ctx.$t('chat.safetyRights')
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{
      class:
        'bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center'
    }
  })
  /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ /** @type {__VLS_StyleScopedClasses['border-b']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ let __VLS_0
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent1(
    __VLS_0,
    new __VLS_0({
      to: `/groups/${__VLS_ctx.groupId}`,
      ...{ class: 'text-gray-400 hover:text-white transition-colors' }
    })
  )
  const __VLS_2 = __VLS_1(
    {
      to: `/groups/${__VLS_ctx.groupId}`,
      ...{ class: 'text-gray-400 hover:text-white transition-colors' }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1)
  )
  /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ const {
    default: __VLS_5
  } = __VLS_3.slots
  __VLS_ctx.$t('chat.backToDetail')
  // @ts-ignore
  ;[userStore, $t, $t, $t, groupId]
  var __VLS_3
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'font-bold text-white flex flex-col items-center' }
  })
  /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-col']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({})
  __VLS_ctx.$t('chat.title')
  if (__VLS_ctx.isDealClosed) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span
    )({
      ...{ class: 'text-xs text-green-400 mt-0.5' }
    })
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['text-green-400']} */ /** @type {__VLS_StyleScopedClasses['mt-0.5']} */ __VLS_ctx.$t(
      'chat.closedLabel'
    )
  }
  __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({})
  if (!__VLS_ctx.hasConfirmed) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button
    )({
      ...{ onClick: __VLS_ctx.handleConfirm },
      disabled: __VLS_ctx.chatStore.loading,
      ...{
        class:
          'bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-1'
      }
    })
    /** @type {__VLS_StyleScopedClasses['bg-green-600/20']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-green-600/30']} */ /** @type {__VLS_StyleScopedClasses['text-green-400']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-green-500/30']} */ /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-1']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span
    )({})
    __VLS_ctx.$t('chat.confirmDeal')
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{
        class:
          'text-xs text-green-500 font-medium px-3 py-1.5 border border-green-500/30 rounded-full bg-green-500/10'
      }
    })
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['text-green-500']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-1.5']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-green-500/30']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['bg-green-500/10']} */ __VLS_ctx.$t(
      'chat.confirmed'
    )
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ref: 'messagesContainer',
    ...{ class: 'flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth' }
  })
  /** @type {__VLS_StyleScopedClasses['flex-1']} */ /** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['scroll-smooth']} */ if (
    __VLS_ctx.isDealClosed
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'flex justify-center my-4' }
    })
    /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['my-4']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{
        class:
          'bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs'
      }
    })
    /** @type {__VLS_StyleScopedClasses['bg-green-500/10']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-green-500/20']} */ /** @type {__VLS_StyleScopedClasses['text-green-400']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['text-xs']} */ __VLS_ctx.$t(
      'chat.systemClosed'
    )
  }
  for (const [msg] of __VLS_vFor(__VLS_ctx.chatStore.messages)) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      key: msg.id,
      ...{ class: 'flex' },
      ...{ class: msg.senderId === __VLS_ctx.userStore.user.uid ? 'justify-end' : 'justify-start' }
    })
    /** @type {__VLS_StyleScopedClasses['flex']} */ if (
      msg.senderId !== __VLS_ctx.userStore.user.uid
    ) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div
      )({
        ...{ class: 'mr-2 flex-shrink-0' }
      })
      /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.img
      )({
        src: msg.senderAvatar || 'https://via.placeholder.com/40',
        ...{ class: 'w-8 h-8 rounded-full border border-white/20' }
      })
      /** @type {__VLS_StyleScopedClasses['w-8']} */
      /** @type {__VLS_StyleScopedClasses['h-8']} */
      /** @type {__VLS_StyleScopedClasses['rounded-full']} */
      /** @type {__VLS_StyleScopedClasses['border']} */
      /** @type {__VLS_StyleScopedClasses['border-white/20']} */
    }
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'max-w-[70%] rounded-2xl px-4 py-2 text-sm' },
      ...{
        class:
          msg.senderId === __VLS_ctx.userStore.user.uid
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
      }
    })
    /** @type {__VLS_StyleScopedClasses['max-w-[70%]']} */ /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ if (
      msg.senderId !== __VLS_ctx.userStore.user.uid
    ) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div
      )({
        ...{ class: 'text-xs text-gray-500 mb-1' }
      })
      /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['mb-1']} */ msg.senderName
    }
    msg.text
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'text-[10px] opacity-50 text-right mt-1' }
    })
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ /** @type {__VLS_StyleScopedClasses['opacity-50']} */ /** @type {__VLS_StyleScopedClasses['text-right']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ __VLS_ctx.formatTime(
      msg.createdAt
    )
    // @ts-ignore
    ;[
      userStore,
      userStore,
      userStore,
      userStore,
      $t,
      $t,
      $t,
      $t,
      $t,
      isDealClosed,
      isDealClosed,
      hasConfirmed,
      handleConfirm,
      chatStore,
      chatStore,
      formatTime
    ]
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'p-4 bg-white/5 backdrop-blur-md border-t border-white/10' }
  })
  /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ /** @type {__VLS_StyleScopedClasses['border-t']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.form,
    __VLS_intrinsics.form
  )({
    ...{ onSubmit: __VLS_ctx.handleSend },
    ...{ class: 'flex gap-2' }
  })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input
  )({
    value: __VLS_ctx.newMessage,
    type: 'text',
    disabled: __VLS_ctx.isDealClosed,
    ...{
      class:
        'flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    },
    placeholder: __VLS_ctx.isDealClosed
      ? __VLS_ctx.$t('chat.inputClosed')
      : __VLS_ctx.$t('chat.inputPlaceholder')
  })
  /** @type {__VLS_StyleScopedClasses['flex-1']} */ /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ /** @type {__VLS_StyleScopedClasses['focus:border-purple-500']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ /** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button
  )({
    type: 'submit',
    disabled: !__VLS_ctx.newMessage.trim() || __VLS_ctx.isDealClosed,
    ...{
      class:
        'bg-purple-600 hover:bg-purple-500 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    },
    'aria-label': 'Send message'
  })
  /** @type {__VLS_StyleScopedClasses['bg-purple-600']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-purple-500']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['w-12']} */ /** @type {__VLS_StyleScopedClasses['h-12']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ /** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ if (
    __VLS_ctx.isDealClosed
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'mt-4 flex justify-center' }
    })
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button
    )({
      ...{
        onClick: (...[$event]) => {
          if (!__VLS_ctx.userStore.user) return
          if (!__VLS_ctx.isDealClosed) return
          __VLS_ctx.showRatingModal = true
          // @ts-ignore
          ;[
            $t,
            $t,
            isDealClosed,
            isDealClosed,
            isDealClosed,
            isDealClosed,
            handleSend,
            newMessage,
            newMessage,
            showRatingModal
          ]
        }
      },
      ...{ class: 'text-sm text-purple-400 hover:text-purple-300 underline' }
    })
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-purple-400']} */ /** @type {__VLS_StyleScopedClasses['hover:text-purple-300']} */ /** @type {__VLS_StyleScopedClasses['underline']} */ __VLS_ctx.$t(
      'chat.ratePartner'
    )
  }
  if (__VLS_ctx.showRatingModal) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4' }
    })
    /** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['bg-black/80']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm relative' }
    })
    /** @type {__VLS_StyleScopedClasses['bg-gray-900']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['max-w-sm']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button
    )({
      ...{
        onClick: (...[$event]) => {
          if (!__VLS_ctx.userStore.user) return
          if (!__VLS_ctx.showRatingModal) return
          __VLS_ctx.showRatingModal = false
          // @ts-ignore
          ;[$t, showRatingModal, showRatingModal]
        }
      },
      ...{ class: 'absolute top-4 right-4 text-gray-400' }
    })
    /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['top-4']} */ /** @type {__VLS_StyleScopedClasses['right-4']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.h3,
      __VLS_intrinsics.h3
    )({
      ...{ class: 'text-xl font-bold text-white mb-4 text-center' }
    })
    /** @type {__VLS_StyleScopedClasses['text-xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ __VLS_ctx.$t(
      'chat.ratingTitle'
    )
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'space-y-4 max-h-[60vh] overflow-y-auto' }
    })
    /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['max-h-[60vh]']} */ /** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ for (const [
      p
    ] of __VLS_vFor(__VLS_ctx.participantsInfo)) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div
      )({
        key: p.uid,
        ...{ class: 'bg-white/5 p-4 rounded-xl' }
      })
      /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div
      )({
        ...{ class: 'flex items-center gap-3 mb-3' }
      })
      /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ /** @type {__VLS_StyleScopedClasses['mb-3']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.img
      )({
        src: p.avatar || 'https://via.placeholder.com/40',
        ...{ class: 'w-10 h-10 rounded-full' }
      })
      /** @type {__VLS_StyleScopedClasses['w-10']} */ /** @type {__VLS_StyleScopedClasses['h-10']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span
      )({
        ...{ class: 'text-white font-medium' }
      })
      /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ p.name
      if (__VLS_ctx.checkRated(p.uid)) {
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div
        )({
          ...{ class: 'text-xs text-green-400 text-center py-2' }
        })
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['text-green-400']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ __VLS_ctx.$t(
          'chat.rated'
        )
      } else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({})
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div
        )({
          ...{ class: 'flex justify-center gap-2 mb-3' }
        })
        /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['mb-3']} */ for (const [
          n
        ] of __VLS_vFor(__VLS_ctx.maxRating)) {
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.button,
            __VLS_intrinsics.button
          )({
            ...{
              onClick: (...[$event]) => {
                if (!__VLS_ctx.userStore.user) return
                if (!__VLS_ctx.showRatingModal) return
                if (!!__VLS_ctx.checkRated(p.uid)) return
                __VLS_ctx.setRating(n, p)
                // @ts-ignore
                ;[$t, $t, participantsInfo, checkRated, maxRating, setRating]
              }
            },
            key: n,
            ...{ class: 'text-2xl transition-transform hover:scale-110' },
            ...{
              class:
                (__VLS_ctx.ratingTarget?.uid === p.uid ? __VLS_ctx.ratingScore : 0) >= n
                  ? 'text-yellow-400'
                  : 'text-gray-600'
            }
          })
          /** @type {__VLS_StyleScopedClasses['text-2xl']} */ /** @type {__VLS_StyleScopedClasses['transition-transform']} */ /** @type {__VLS_StyleScopedClasses['hover:scale-110']} */ // @ts-ignore
          ;[ratingTarget, ratingScore]
        }
        if (__VLS_ctx.ratingTarget?.uid === p.uid) {
          const __VLS_6 = BaseTextarea
          // @ts-ignore
          const __VLS_7 = __VLS_asFunctionalComponent1(
            __VLS_6,
            new __VLS_6({
              modelValue: __VLS_ctx.ratingComment,
              placeholder: __VLS_ctx.$t('chat.ratingPlaceholder'),
              ...{ class: 'mb-2' }
            })
          )
          const __VLS_8 = __VLS_7(
            {
              modelValue: __VLS_ctx.ratingComment,
              placeholder: __VLS_ctx.$t('chat.ratingPlaceholder'),
              ...{ class: 'mb-2' }
            },
            ...__VLS_functionalComponentArgsRest(__VLS_7)
          )
          /** @type {__VLS_StyleScopedClasses['mb-2']} */
        }
        if (__VLS_ctx.ratingTarget?.uid === p.uid) {
          const __VLS_11 = BaseButton || BaseButton
          // @ts-ignore
          const __VLS_12 = __VLS_asFunctionalComponent1(
            __VLS_11,
            new __VLS_11({
              ...{ onClick: {} },
              disabled: !__VLS_ctx.ratingComment.trim()
            })
          )
          const __VLS_13 = __VLS_12(
            {
              ...{ onClick: {} },
              disabled: !__VLS_ctx.ratingComment.trim()
            },
            ...__VLS_functionalComponentArgsRest(__VLS_12)
          )
          let __VLS_16
          const __VLS_17 = ({ click: {} }, { onClick: __VLS_ctx.handleRate })
          const { default: __VLS_18 } = __VLS_14.slots
          __VLS_ctx.$t('chat.submitRating', { score: __VLS_ctx.ratingScore })
          // @ts-ignore
          ;[
            $t,
            $t,
            ratingTarget,
            ratingTarget,
            ratingScore,
            ratingComment,
            ratingComment,
            handleRate
          ]
          var __VLS_14
          var __VLS_15
        }
      }
      // @ts-ignore
      ;[]
    }
    if (__VLS_ctx.participantsInfo.length === 0) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div
      )({
        ...{ class: 'text-center text-gray-500 py-4' }
      })
      /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['py-4']} */ __VLS_ctx.$t(
        'chat.noTarget'
      )
    }
  }
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'h-screen flex items-center justify-center text-gray-400' }
  })
  /** @type {__VLS_StyleScopedClasses['h-screen']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ __VLS_ctx.$t(
    'chat.loginRequired'
  )
}
// @ts-ignore
;[$t, $t, participantsInfo]
const __VLS_export = (await import('vue')).defineComponent({})
export default {}
//# sourceMappingURL=ChatRoomView.vue.js.map
