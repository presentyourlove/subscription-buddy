<template>
  <div class="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto bg-[#0f172a]" v-if="userStore.user">
    
    <!-- Safety Header -->
    <div class="bg-amber-500/10 border-b border-amber-500/20 p-3 flex flex-col items-center justify-center text-amber-500 text-sm font-medium text-center gap-1">
      <span>⚠️ 請勿在此聊天室傳送信用卡號、密碼等敏感資訊。</span>
      <span>⚠️ 請確認權益後再同意結案，結案前請勿刪除對話。</span>
    </div>

    <!-- Chat Header -->
    <div class="bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
      <router-link :to="`/groups/${groupId}`" class="text-gray-400 hover:text-white transition-colors">
        ← 返回拼團詳情
      </router-link>
      <div class="font-bold text-white flex flex-col items-center">
        <span>專案聊天室</span>
        <span v-if="isDealClosed" class="text-xs text-green-400 mt-0.5">✅ 雙方已確認結案</span>
      </div>
      <div>
        <button 
          v-if="!hasConfirmed"
          @click="handleConfirm"
          :disabled="chatStore.loading"
          class="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-1"
        >
          <span>🤝</span> 確認結案
        </button>
        <div v-else class="text-xs text-green-500 font-medium px-3 py-1.5 border border-green-500/30 rounded-full bg-green-500/10">
          已確認
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref="messagesContainer">
      
      <!-- System Message: Deal Closed -->
      <div v-if="isDealClosed" class="flex justify-center my-4">
        <div class="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs">
          此交易已由雙方確認結案，請記得給予對方評價！
        </div>
      </div>

      <div v-for="msg in chatStore.messages" :key="msg.id" 
        class="flex" 
        :class="msg.senderId === userStore.user.uid ? 'justify-end' : 'justify-start'"
      >
        <!-- Other's Avatar -->
        <div v-if="msg.senderId !== userStore.user.uid" class="mr-2 flex-shrink-0">
          <img :src="msg.senderAvatar || 'https://via.placeholder.com/40'" class="w-8 h-8 rounded-full border border-white/20" />
        </div>

        <!-- Bubble -->
        <div class="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
          :class="msg.senderId === userStore.user.uid 
            ? 'bg-purple-600 text-white rounded-br-none' 
            : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'"
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
      <form @submit.prevent="handleSend" class="flex gap-2">
        <input 
          v-model="newMessage" 
          type="text" 
          :disabled="isDealClosed"
          class="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :placeholder="isDealClosed ? '此交易已結案，無法再傳送訊息' : '輸入訊息...'" 
        />
        <button 
          type="submit" 
          :disabled="!newMessage.trim() || isDealClosed"
          class="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➤
        </button>
      </form>
      
      <!-- Rating Trigger (Only when closed) -->
      <div v-if="isDealClosed" class="mt-4 flex justify-center">
        <button @click="showRatingModal = true" class="text-sm text-purple-400 hover:text-purple-300 underline">
          ⭐ 評價您的夥伴
        </button>
      </div>
    </div>

    <!-- Rating Modal -->
    <div v-if="showRatingModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
            <button @click="showRatingModal = false" class="absolute top-4 right-4 text-gray-400">✕</button>
            <h3 class="text-xl font-bold text-white mb-4 text-center">評價夥伴</h3>
            
            <div class="space-y-4 max-h-[60vh] overflow-y-auto">
                <div v-for="p in participantsInfo" :key="p.uid" class="bg-white/5 p-4 rounded-xl">
                    <div class="flex items-center gap-3 mb-3">
                        <img :src="p.avatar || 'https://via.placeholder.com/40'" class="w-10 h-10 rounded-full">
                        <span class="text-white font-medium">{{ p.name }}</span>
                    </div>
                    
                    <div v-if="checkRated(p.uid)" class="text-xs text-green-400 text-center py-2">
                       ✅ 已完成評價
                    </div>
                    <div v-else>
                         <div class="flex justify-center gap-2 mb-3">
                             <button v-for="n in 5" :key="n" @click="ratingScore = n; ratingTarget = p" 
                                class="text-2xl transition-transform hover:scale-110"
                                :class="(ratingTarget?.uid === p.uid ? ratingScore : 0) >= n ? 'text-yellow-400' : 'text-gray-600'">
                                ★
                             </button>
                         </div>
                         <textarea 
                           v-if="ratingTarget?.uid === p.uid"
                           v-model="ratingComment"
                           placeholder="請填寫評語 (必填)..."
                           class="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-purple-500 mb-2 h-20 resize-none"
                         ></textarea>
                         <button 
                           v-if="ratingTarget?.uid === p.uid"
                           @click="handleRate"
                           :disabled="!ratingComment.trim()"
                           class="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            送出 {{ ratingScore }} 星評價
                         </button>
                    </div>
                </div>
                <div v-if="participantsInfo.length === 0" class="text-center text-gray-500 py-4">
                    沒有可評價的對象 (僅能評價有發言過的成員)
                </div>
            </div>
        </div>
    </div>

  </div>
  <div v-else class="h-screen flex items-center justify-center text-gray-400">
    請先登入以檢視聊天室。
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '../stores/chatStore'
import { useUserStore } from '../stores/userStore'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

import { useGroupStore } from '../stores/groupStore'

const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()
const groupStore = useGroupStore() // Import groupStore

const groupId = route.params.id
// Extra state for chat document (to watch confirmedUsers)
const chatMeta = ref(null)
let metaUnsubscribe = null

const hasConfirmed = computed(() => {
  if (!chatMeta.value || !chatMeta.value.confirmedUsers || !userStore.user) return false
  return chatMeta.value.confirmedUsers.includes(userStore.user.uid)
})

const isDealClosed = computed(() => {
    // Simple logic: if at least 2 people confirmed, or all participants. 
    // Let's say if > 1 confirmed for now as MVP, or same count as participants
    if (!chatMeta.value || !chatMeta.value.confirmedUsers) return false
    const participants = chatMeta.value.participants || []
    const confirmed = chatMeta.value.confirmedUsers || []
    // If everyone confirmed
    return participants.length > 0 && confirmed.length >= participants.length
})

// Watch deal closed to auto-update group status (Only Host can do this)
watch(isDealClosed, async (val) => {
  if (val && chatMeta.value && userStore.user) {
     await groupStore.updateGroupStatus(groupId, 'CLOSED')
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
        metaUnsubscribe = onSnapshot(doc(db, "chats", groupId), (doc) => {
           chatMeta.value = doc.data()
        })
    }
  } catch (err) {
    alert("加入聊天室失敗 (可能是權限問題): " + err.message)
  }
}

onMounted(() => {
    initChat()
})

// Watch for auth ready if page refreshed
watch(() => userStore.user, (val) => {
    if (val) initChat()
})

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
watch(() => chatStore.messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

const handleSend = async () => {
  if (!newMessage.value.trim()) return
  try {
    await chatStore.sendMessage(newMessage.value, userStore.user)
    newMessage.value = ''
  } catch (err) {
    alert("發送失敗: " + err.message)
  }
}

const handleConfirm = async () => {
  if (!confirm("確認結案？這表示您已完成交易 (已付款/已收款)。")) return
  try {
    await chatStore.confirmDeal(groupId, userStore.user)
  } catch (err) {
    alert("確認失敗: " + err.message)
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return '...'
  return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// --- Rating System ---
const showRatingModal = ref(false)
const ratingTarget = ref(null) // { uid, name, avatar }
const ratingScore = ref(5)
const ratingComment = ref('')

const participantsInfo = computed(() => {
    // We need complete info (name, avatar) for participants.
    // Ideally userStore or chatStore should provide this.
    // For now, let's extract unique senders from messages as a fallback or use chatMeta.participants (IDs only).
    // Better strategy: ChatStore messages contain senderName/Avatar.
    // Let's gather unique participants from messages history + current User.
    // BUT, if someone didn't speak, they won't be here.
    // Detailed implementation: Fetch user profiles. For MVP, we use message senders.
    
    if (!chatStore.messages) return []
    const senders = {}
    chatStore.messages.forEach(m => {
        if (m.senderId !== userStore.user.uid) {
            senders[m.senderId] = {
                uid: m.senderId,
                name: m.senderName,
                avatar: m.senderAvatar
            }
        }
    })
    return Object.values(senders)
})

const handleRate = async () => {
    if (!ratingTarget.value) return
    try {
        await chatStore.rateUser(groupId, ratingTarget.value.uid, ratingScore.value, ratingComment.value, userStore.user.uid)
        alert(`已成功給予 ${ratingTarget.value.name} ${ratingScore.value} 星評價！`)
        showRatingModal.value = false
        ratingComment.value = '' // Reset
        // Refresh meta logic? onSnapshot handles it.
    } catch (err) {
        alert("評分失敗: " + err)
    }
}

const checkRated = (targetUid) => {
    if (!chatMeta.value || !chatMeta.value.ratings) return false
    const myRatings = chatMeta.value.ratings[userStore.user.uid]
    return myRatings && myRatings[targetUid] !== undefined
}
</script>
