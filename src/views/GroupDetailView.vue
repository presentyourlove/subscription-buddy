<template>
  <div class="max-w-4xl mx-auto px-4 py-8" v-if="group">
    
    <!-- Back Button -->
    <router-link to="/" class="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
      <span class="mr-2">←</span> 回到公佈欄
    </router-link>

    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            {{ group.title }}
            <span class="px-3 py-1 text-sm rounded-full border"
              :class="{
                'bg-green-500/20 text-green-300 border-green-500/30': group.status === 'OPEN',
                'bg-red-500/20 text-red-300 border-red-500/30': group.status !== 'OPEN'
              }">
              {{ group.status === 'OPEN' ? '募集中' : '已額滿' }}
            </span>
          </h1>
          <div class="flex items-center text-gray-400 text-sm gap-4">
            <span class="flex items-center gap-1">
              👤 團長: {{ group.hostName }}
            </span>
            <span>🕒 發佈於: {{ formatDate(group.createdAt) }}</span>
          </div>
        </div>

        <!-- Host Actions -->
        <div v-if="isHost" class="flex gap-3">
           <button @click="handleDelete" 
             class="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors text-sm font-medium">
             刪除拼團
           </button>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <div class="text-gray-500 text-sm mb-1">每人費用</div>
          <div class="text-2xl font-bold text-purple-300">${{ group.price }} <span class="text-sm text-gray-500">/月</span></div>
        </div>
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <div class="text-gray-500 text-sm mb-1">目前缺額</div>
          <div class="text-2xl font-bold text-white">{{ group.slots }} <span class="text-sm text-gray-500">人</span></div>
        </div>
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <div class="text-gray-500 text-sm mb-1">付款方式</div>
          <div class="text-lg font-medium text-gray-300">私訊討論</div>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-white mb-3">詳細說明</h3>
        <p class="text-gray-300 whitespace-pre-line leading-relaxed bg-black/10 p-4 rounded-xl border border-white/5">
          {{ group.description }}
        </p>
      </div>

      <!-- Action Area (Join/Chat) -->
      <div class="pt-8 border-t border-white/10">
        <div v-if="!isHost">
          <button 
            v-if="group.status === 'OPEN'"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1"
          >
            申請加入 (開啟聊天室)
          </button>
          <button 
            v-else
            disabled
            class="w-full bg-gray-600 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed"
          >
            本團已額滿
          </button>
        </div>
        <div v-else class="text-center text-gray-400 text-sm">
          您是團長，等待團員申請中...
        </div>
      </div>

    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-500">
    載入中或找不到該拼團...
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()

const group = ref(null)

onMounted(async () => {
  const id = route.params.id
  // Try to find in store first
  let found = groupStore.groups.find(g => g.id === id)
  if (!found) {
    await groupStore.fetchGroups()
    found = groupStore.groups.find(g => g.id === id)
  }
  group.value = found
})

const isHost = computed(() => {
  return group.value && userStore.user && group.value.hostId === userStore.user.uid
})

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}

const handleDelete = async () => {
  if (!confirm('確定要刪除這個拼團嗎？此動作無法復原。')) return
  try {
    await groupStore.deleteGroup(group.value.id)
    router.push('/')
  } catch (err) {
    alert("刪除失敗: " + err.message)
  }
}
</script>
