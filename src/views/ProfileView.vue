<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
    <!-- Error Boundary UI -->
    <div
      v-if="globalError"
      class="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-xl mb-6"
    >
      <strong>{{ $t('common.errorTitle') }}</strong> {{ globalError }}
      <p class="text-sm mt-1">{{ $t('common.refreshHint') }}</p>
    </div>

    <!-- Loading / Auth State -->
    <div v-if="!userStore.user" class="text-center py-20 text-gray-400">
      <div class="animate-spin text-4xl mb-4">⌛</div>
      <p>{{ $t('common.loadingData') }}</p>
    </div>

    <div v-else>
      <!-- Profile Header -->
      <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl"
      >
        <!-- Avatar -->
        <div class="relative group">
          <div
            class="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg bg-gray-700 flex items-center justify-center text-4xl"
          >
            <LazyImage
              v-if="userStore.user.photoURL"
              :src="userStore.user.photoURL"
              image-class="w-full h-full object-cover"
              container-class="w-full h-full"
            />
            <span v-else>👤</span>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 text-center md:text-left">
          <h1
            class="text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3"
          >
            {{ userStore.user.displayName || $t('profile.defaultName') }}
            <button
              class="text-sm bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-gray-300"
              aria-label="Edit profile"
              @click="openEditModal"
            >
              ✏️
            </button>
          </h1>
          <p class="text-gray-400 mb-4">{{ userStore.user.email }}</p>

          <!-- Reputation -->
          <div
            class="inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5"
          >
            <span class="text-gray-400 text-sm">{{ $t('profile.reputation') }}</span>
            <UserRating :uid="userStore.user.uid" size="lg" />
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="isEditing" class="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 class="text-lg font-bold mb-4">{{ $t('profile.edit.title') }}</h3>
        <form class="space-y-4" @submit.prevent="handleUpdate">
          <div>
            <BaseInput
              v-model="editForm.displayName"
              :label="$t('profile.edit.displayName')"
              required
            />
          </div>

          <div>
            <BaseInput
              v-model="editForm.photoURL"
              :label="$t('profile.edit.photoURL')"
              placeholder="https://..."
              type="url"
            />
          </div>
          <div class="flex gap-4 pt-2">
            <BaseButton type="submit" :loading="loading">
              {{ $t('profile.edit.save') }}
            </BaseButton>
            <button
              type="button"
              class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold transition-colors w-full"
              @click="isEditing = false"
            >
              {{ $t('profile.edit.cancel') }}
            </button>
          </div>
        </form>
      </div>

      <!-- History Tabs -->
      <div class="mb-6 border-b border-white/10 flex gap-8">
        <button
          class="pb-3 text-lg font-bold transition-colors border-b-2"
          :class="
            activeTab === 'hosted'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          "
          @click="activeTab = 'hosted'"
        >
          {{ $t('profile.tabs.hosted') }} ({{ hostedGroups.length }})
        </button>
        <button
          class="pb-3 text-lg font-bold transition-colors border-b-2"
          :class="
            activeTab === 'joined'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          "
          @click="activeTab = 'joined'"
        >
          {{ $t('profile.tabs.joined') }} ({{ joinedGroups.length }})
        </button>
      </div>

      <p
        class="text-sm text-gray-400 mb-4 flex items-center gap-1 font-medium bg-blue-500/10 p-2 rounded-lg border border-blue-500/20"
      >
        ℹ️ {{ $t('profile.info.chatRetention') }}
      </p>

      <!-- Groups List -->
      <div v-if="loadingHistory" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"
        ></div>
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="group in currentList"
          :key="group.id"
          class="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
          @click="navigateTo(group)"
        >
          <div class="flex items-center gap-4">
            <!-- Service Icon -->
            <div
              class="h-12 w-12 flex items-center justify-center rounded-lg overflow-hidden bg-white/5"
            >
              <img
                v-if="group.id && getServiceLogo(group.title) && !imageErrorMap[group.id]"
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
              <span
                class="text-xs px-2 py-0.5 rounded border"
                :class="{
                  'border-green-500/30 text-green-300 bg-green-500/10': group.status === 'OPEN',
                  'border-red-500/30 text-red-300 bg-red-500/10': group.status === 'FULL',
                  'border-gray-500/30 text-gray-400 bg-gray-500/10': group.status === 'CLOSED'
                }"
              >
                {{ group.status }}
              </span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-purple-300 font-bold">${{ group.price }}</div>
            <div class="text-xs text-gray-500">{{ formatDate(group.createdAt) }}</div>
          </div>
        </div>

        <div
          v-if="currentList.length === 0"
          class="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10"
        >
          {{ $t('profile.emptyHistory') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import UserRating from '../components/UserRating.vue'
import { db } from '../firebase/config'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import LazyImage from '../components/LazyImage.vue'
import { useI18n } from 'vue-i18n'
import { Group } from '../types'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const isEditing = ref(false)
const loading = ref(false)
const loadingHistory = ref(false)
const globalError = ref<string | null>(null)

const activeTab = ref('hosted')
const hostedGroups = ref<Group[]>([])
const joinedGroups = ref<Group[]>([])

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
  } catch (e) {
    alert(t('profile.error.updateFailed') + ': ' + (e as Error).message)
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
    hostedGroups.value = snapHosted.docs.map((d) => ({ id: d.id, ...d.data() }) as Group)

    // 2. Joined Chats -> Groups
    const qChats = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userStore.user.uid)
    )
    const snapChats = await getDocs(qChats)

    const joined: Group[] = []
    for (const cDoc of snapChats.docs) {
      const groupId = cDoc.id
      // Skip if I am the host
      if (hostedGroups.value.find((g) => g.id === groupId)) continue

      try {
        const gRef = doc(db, 'groups', groupId)
        const gSnap = await getDoc(gRef)
        if (gSnap.exists()) {
          joined.push({ id: gSnap.id, ...gSnap.data() } as Group)
        }
      } catch (innerErr) {
        console.warn('Skipping invalid group ref:', groupId, innerErr)
      }
    }
    joinedGroups.value = joined
  } catch (e) {
    console.error('Fetch history failed:', e)
    globalError.value = t('profile.error.fetchFailed') + ': ' + (e as Error).message
  } finally {
    loadingHistory.value = false
  }
}

const formatDate = (ts: any) => {
  if (!ts) return ''
  try {
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return date.toLocaleDateString()
  } catch (e) {
    return 'Invalid Date'
  }
}

const navigateTo = (group: Group) => {
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
watch(
  () => userStore.user,
  (val) => {
    if (val && val.uid) {
      fetchHistory()
    }
  },
  { immediate: true }
)

const imageErrorMap = ref<Record<string, boolean>>({})

const handleImageError = (id: string | undefined) => {
  if (id) imageErrorMap.value[id] = true
}

const getServiceLogo = (title: string | undefined) => {
  if (!title) return undefined
  const t = title.toLowerCase()
  if (t.includes('netflix'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
  if (t.includes('spotify'))
    return 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
  if (t.includes('youtube'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'
  if (t.includes('disney'))
    return 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg'
  if (t.includes('apple') || t.includes('icloud'))
    return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  if (t.includes('nintendo') || t.includes('switch'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg'
  if (t.includes('chatgpt') || t.includes('openai'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  return undefined
}
</script>
