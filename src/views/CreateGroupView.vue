<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
      <h1 class="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        發起新拼團
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Service Name -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">服務名稱</label>
          <input 
            v-model="form.title" 
            type="text" 
            required
            placeholder="e.g. Netflix Premium (4人團)"
            class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">說明</label>
          <textarea 
            v-model="form.description" 
            required
            rows="3"
            placeholder="簡述方案內容、付款方式..."
            class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Price -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">每人價格 (月)</label>
            <div class="relative">
              <span class="absolute left-4 top-3 text-gray-500">$</span>
              <input 
                v-model.number="form.price" 
                type="number" 
                required
                min="0"
                class="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <!-- Slots -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">徵求人數</label>
            <input 
              v-model.number="form.slots" 
              type="number" 
              required
              min="1"
              max="10"
              class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="groupStore.loading"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            <span v-if="groupStore.loading">處理中...</span>
            <span v-else>發佈拼團</span>
          </button>
        </div>

        <p v-if="groupStore.error" class="text-red-400 text-center text-sm">
          {{ groupStore.error }}
        </p>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'

import { useChatStore } from '../stores/chatStore' // Import chatStore

const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()
const chatStore = useChatStore() // Init chatStore

const form = reactive({
  title: '',
  description: '',
  price: '',
  slots: ''
})

const handleSubmit = async () => {
  if (!userStore.user) {
    alert("請先登入！")
    return
  }

  try {
     // Check for pending reviews
    const pendingGroupId = await chatStore.checkPendingReviews(userStore.user)
    if (pendingGroupId) {
        if(confirm(`您有尚未完成的評價 (GroupID: ${pendingGroupId})。請先完成評價才能建立新拼團！\n是否前往評價？`)) {
            router.push(`/chat/${pendingGroupId}`)
        }
        return
    }

    await groupStore.addGroup({
      ...form, // Flatten reactive object
      hostId: userStore.user.uid,
      hostName: userStore.user.displayName || '匿名',
      hostAvatar: userStore.user.photoURL || ''
    })
    alert("發佈成功！")
    router.push('/')
  } catch (err) {
    // Error is handled in store, simply stay on page to show it
  }
}
</script>
