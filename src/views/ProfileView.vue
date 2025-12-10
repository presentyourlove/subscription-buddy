<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
    
    <!-- Error Boundary UI -->
    <div v-if="globalError" class="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-xl mb-6">
       <strong>發生錯誤：</strong> {{ globalError }}
       <p class="text-sm mt-1">請嘗試重新整理頁面。</p>
    </div>

    <!-- Loading / Auth State -->
    <div v-if="!userStore.user" class="text-center py-20 text-gray-400">
       <div class="animate-spin text-4xl mb-4">⌛</div>
       <p>載入使用者資料中...</p>
    </div>

    <div v-else>
        <!-- Profile Header -->
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <!-- Avatar -->
          <div class="relative group">
             <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg bg-gray-700 flex items-center justify-center text-4xl">
                <img v-if="userStore.user.photoURL" :src="userStore.user.photoURL" class="w-full h-full object-cover" />
                <span v-else>👤</span>
             </div>
          </div>

          <!-- Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
              {{ userStore.user.displayName || '未命名使用者' }}
              <button @click="openEditModal" class="text-sm bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-gray-300">
                 ✏️
              </button>
            </h1>
            <p class="text-gray-400 mb-4">{{ userStore.user.email }}</p>
            
            <!-- Reputation -->
            <div class="inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
               <span class="text-gray-400 text-sm">信譽評分</span>
               <UserRating :uid="userStore.user.uid" size="lg" />
            </div>
          </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="isEditing" class="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
           <h3 class="text-lg font-bold mb-4">編輯個人資料</h3>
           <form @submit.prevent="handleUpdate" class="space-y-4">
              <div>
                 <label class="block text-sm text-gray-400 mb-1">顯示名稱</label>
                 <input v-model="editForm.displayName" type="text" class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white" required />
              </div>
              <div>
                 <label class="block text-sm text-gray-400 mb-1">頭像網址 (URL)</label>
                 <input v-model="editForm.photoURL" type="url" class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="https://..." />
              </div>
              <div class="flex gap-4 pt-2">
                 <button type="submit" :disabled="loading" class="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    {{ loading ? '儲存中...' : '儲存變更' }}
                 </button>
                 <button type="button" @click="isEditing = false" class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    取消
                 </button>
              </div>
           </form>
        </div>

        <!-- History Tabs -->
        <div class="mb-6 border-b border-white/10 flex gap-8">
           <button @click="activeTab = 'hosted'" class="pb-3 text-lg font-bold transition-colors border-b-2" :class="activeTab === 'hosted' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'">
              我主辦的 ({{ hostedGroups.length }})
           </button>
           <button @click="activeTab = 'joined'" class="pb-3 text-lg font-bold transition-colors border-b-2" :class="activeTab === 'joined' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'">
              我參與的 ({{ joinedGroups.length }})
           </button>
        </div>

        <p class="text-sm text-gray-400 mb-4 flex items-center gap-1 font-medium bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
            ℹ️ 聊天室內容只會儲存一年，系統將於雙方確認結案後自動計算，期滿自動刪除。
        </p>

        <!-- Groups List -->
        <div v-if="loadingHistory" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
        
        <div v-else class="grid gap-4">
            <div v-for="group in currentList" :key="group.id" 
                 class="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                 @click="navigateTo(group)">
                
                <div class="flex items-center gap-4">
                    <!-- Service Icon -->
                    <div class="h-12 w-12 flex items-center justify-center rounded-lg overflow-hidden bg-white/5">
                        <img 
                            v-if="getServiceLogo(group.title) && !imageErrorMap[group.id]"
                            :src="getServiceLogo(group.title)" 
                            class="h-full w-full object-contain"
                            alt="Service Logo"
                            @error="handleImageError(group.id)"
                        />
                        <div v-else class="text-2xl">
                            {{ activeTab === 'hosted' ? '👑' : '👋' }}
                        </div>
                    </div>
                    <div>
                       <h3 class="font-bold text-lg">{{ group.title }}</h3>
                       <span class="text-xs px-2 py-0.5 rounded border"
                          :class="{
                            'border-green-500/30 text-green-300 bg-green-500/10': group.status === 'OPEN',
                            'border-red-500/30 text-red-300 bg-red-500/10': group.status === 'FULL',
                            'border-gray-500/30 text-gray-400 bg-gray-500/10': group.status === 'CLOSED'
                          }">
                          {{ group.status }}
                       </span>
                    </div>
                </div>
                
                <div class="text-right">
                   <div class="text-purple-300 font-bold">${{ group.price }}</div>
                   <div class="text-xs text-gray-500">{{ formatDate(group.createdAt) }}</div>
                </div>
            </div>
            
            <div v-if="currentList.length === 0" class="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
               尚無紀錄
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import UserRating from '../components/UserRating.vue'
import { db } from '../firebase/config'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const userStore = useUserStore()

const isEditing = ref(false)
const loading = ref(false)
const loadingHistory = ref(false)
const globalError = ref(null)

const activeTab = ref('hosted') 
const hostedGroups = ref([])
const joinedGroups = ref([])

const editForm = ref({
    displayName: '',
    photoURL: ''
})

const openEditModal = () => {
    editForm.value = {
        displayName: userStore.user?.displayName || '',
        photoURL: userStore.user?.photoURL || ''
    }
    isEditing.value = true
}

const handleUpdate = async () => {
    loading.value = true
    try {
        await userStore.updateUserProfile(editForm.value.displayName, editForm.value.photoURL)
        isEditing.value = false
    } catch(e) {
        alert("更新失敗: " + e.message)
    } finally {
        loading.value = false
    }
}

const fetchHistory = async () => {
    if (!userStore.user?.uid) return
    loadingHistory.value = true
    globalError.value = null // Clear previous errors

    try {
        // 1. Hosted Groups
        const qHosted = query(collection(db, 'groups'), where('hostId', '==', userStore.user.uid))
        const snapHosted = await getDocs(qHosted)
        hostedGroups.value = snapHosted.docs.map(d => ({ id: d.id, ...d.data() }))

        // 2. Joined Chats -> Groups
        const qChats = query(collection(db, 'chats'), where('participants', 'array-contains', userStore.user.uid))
        const snapChats = await getDocs(qChats)
        
        const joined = []
        for (const cDoc of snapChats.docs) {
             const groupId = cDoc.id
             // Skip if I am the host
             if (hostedGroups.value.find(g => g.id === groupId)) continue 

             try {
                const gRef = doc(db, 'groups', groupId)
                const gSnap = await getDoc(gRef)
                if (gSnap.exists()) {
                    joined.push({ id: gSnap.id, ...gSnap.data() })
                }
             } catch(innerErr) {
                 console.warn("Skipping invalid group ref:", groupId, innerErr)
             }
        }
        joinedGroups.value = joined

    } catch(e) {
        console.error("Fetch history failed:", e)
        globalError.value = "讀取歷史紀錄失敗: " + e.message
    } finally {
        loadingHistory.value = false
    }
}

const formatDate = (ts) => {
    if (!ts) return ''
    try {
        const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
        return date.toLocaleDateString()
    } catch (e) {
        return 'Invalid Date'
    }
}

const navigateTo = (group) => {
    if (activeTab.value === 'joined') {
        router.push(`/chat/${group.id}`)
    } else {
        router.push(`/groups/${group.id}`)
    }
}

const currentList = computed(() => {
    return activeTab.value === 'hosted' ? hostedGroups.value : joinedGroups.value
})

// Initialize
watch(() => userStore.user, (val) => {
    if (val && val.uid) {
        fetchHistory()
    }
}, { immediate: true })

const imageErrorMap = ref({})

const handleImageError = (id) => {
  imageErrorMap.value[id] = true
}

const getServiceLogo = (title) => {
  const t = title.toLowerCase()
  if (t.includes('netflix')) return 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
  if (t.includes('spotify')) return 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
  if (t.includes('youtube')) return 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'
  if (t.includes('disney')) return 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg'
  if (t.includes('apple') || t.includes('icloud')) return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  if (t.includes('nintendo') || t.includes('switch')) return 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg'
  if (t.includes('chatgpt') || t.includes('openai')) return 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  return null
}


</script>
