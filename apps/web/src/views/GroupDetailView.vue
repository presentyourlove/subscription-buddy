<template>
  <div v-if="group" class="max-w-4xl mx-auto px-4 py-8">
    <!-- DEBUG INFO -->

    <!-- Back Button -->
    <router-link
      to="/"
      class="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
    >
      <span class="mr-2">←</span> {{ $t('group.detail.back') }}
    </router-link>

    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            {{ group.title }}
            <span
              class="px-3 py-1 text-sm rounded-full border"
              :class="{
                'bg-green-500/20 text-green-300 border-green-500/30':
                  group.status === GROUP_STATUS.OPEN,
                'bg-gray-500/20 text-gray-300 border-gray-500/30':
                  group.status === GROUP_STATUS.CLOSED,
                'bg-red-500/20 text-red-300 border-red-500/30': group.status === GROUP_STATUS.FULL
              }"
            >
              {{ $t(`group.status.${group.status}`) }}
            </span>
          </h1>
          <div class="flex items-center text-gray-400 text-sm gap-4">
            <span class="flex items-center gap-2">
              👤 {{ $t('group.detail.host') }}: {{ group.hostName }}
              <UserRating :uid="group.hostId" />
            </span>
            <span>🕒 {{ $t('group.detail.postedAt') }}: {{ formatDate(group.createdAt) }}</span>
          </div>
        </div>

        <!-- Host Actions -->
        <div v-if="isHost" class="flex gap-3">
          <button
            v-if="group.status !== GROUP_STATUS.CLOSED"
            class="px-4 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border border-gray-500/20 rounded-lg transition-colors text-sm font-medium"
            @click="handleCloseGroup"
          >
            {{ $t('group.detail.manualClose') }}
          </button>
          <button
            v-if="group.status !== GROUP_STATUS.CLOSED"
            class="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors text-sm font-medium"
            @click="handleDelete"
          >
            {{ $t('group.detail.deleteGroup') }}
          </button>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <div class="text-gray-500 text-sm mb-1">{{ $t('group.detail.pricePerMonth') }}</div>
          <div class="text-2xl font-bold text-purple-300">
            ${{ group.price }}
            <span class="text-sm text-gray-500">{{ $t('home.card.month') }}</span>
          </div>
        </div>
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <div class="text-gray-500 text-sm mb-1">{{ $t('group.detail.slotsLeft') }}</div>
          <div class="text-2xl font-bold text-white">
            {{ group.slots }}
            <span class="text-sm text-gray-500">{{ $t('home.card.people') }}</span>
          </div>
        </div>
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <div class="text-gray-500 text-sm mb-1">{{ $t('group.detail.paymentMethod') }}</div>
          <div class="text-lg font-medium text-gray-300">
            {{ $t('group.detail.paymentMethodValue') }}
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-white mb-3">{{ $t('group.detail.description') }}</h3>
        <p
          class="text-gray-300 whitespace-pre-line leading-relaxed bg-black/10 p-4 rounded-xl border border-white/5"
        >
          {{ group.description }}
        </p>
      </div>

      <!-- Action Area (Join/Chat) -->
      <div class="pt-8 border-t border-white/10">
        <!-- 
           Temporary Fix: Show "Enter Chat" for everyone if Closed, 
           so members can still access. Real permission handled by Firestore/ChatStore.
        -->
        -->
        <div v-if="isHost || group.status === GROUP_STATUS.CLOSED" class="flex flex-col gap-4">
          <router-link
            :to="`/chat/${group.id}`"
            class="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1"
          >
            {{ $t('group.detail.enterChat') }} ({{
              isHost ? $t('group.detail.hostRole') : $t('group.detail.closedRole')
            }})
          </router-link>
          <div v-if="isHost" class="text-center text-gray-400 text-sm">
            {{ $t('group.detail.hostHint') }}
          </div>
        </div>

        <div v-else>
          <router-link
            v-if="group.status === GROUP_STATUS.OPEN"
            :to="`/chat/${group.id}`"
            class="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1"
          >
            {{ $t('group.detail.applyJoin') }}
          </router-link>
          <button
            v-else
            disabled
            class="w-full bg-gray-600 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed"
          >
            {{ $t('group.detail.full') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="max-w-4xl mx-auto px-4 py-8">
    <!-- Back Button Skeleton -->
    <div class="mb-6">
      <BaseSkeleton width="120px" height="1.5em" />
    </div>

    <div class="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
      <!-- Header Skeleton -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div class="flex-1 w-full">
          <div class="flex items-center gap-3 mb-2">
            <BaseSkeleton width="200px" height="2em" />
            <BaseSkeleton width="80px" height="1.5em" variant="rectangular" class="rounded-full" />
          </div>
          <div class="flex items-center gap-4">
            <BaseSkeleton width="150px" height="1em" />
            <BaseSkeleton width="180px" height="1em" />
          </div>
        </div>
      </div>

      <!-- Info Grid Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <BaseSkeleton width="80px" height="1em" class="mb-2" />
          <BaseSkeleton width="60%" height="1.5em" />
        </div>
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <BaseSkeleton width="80px" height="1em" class="mb-2" />
          <BaseSkeleton width="60%" height="1.5em" />
        </div>
        <div class="bg-black/20 rounded-xl p-4 border border-white/5">
          <BaseSkeleton width="80px" height="1em" class="mb-2" />
          <BaseSkeleton width="60%" height="1.5em" />
        </div>
      </div>

      <!-- Description Skeleton -->
      <div class="mb-8">
        <BaseSkeleton width="100px" height="1.2em" class="mb-3" />
        <div class="bg-black/10 p-4 rounded-xl border border-white/5 space-y-2">
          <BaseSkeleton width="100%" />
          <BaseSkeleton width="100%" />
          <BaseSkeleton width="80%" />
        </div>
      </div>

      <!-- Action Area Skeleton -->
      <div class="pt-8 border-t border-white/10">
        <BaseSkeleton width="100%" height="3.5em" variant="rectangular" class="rounded-xl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import BaseSkeleton from '../components/BaseSkeleton.vue'
import UserRating from '../components/UserRating.vue'
import { useFirestoreDoc } from '../composables/useFirestoreDoc'
import { useNotification } from '../composables/useNotification'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'
import { Group, GROUP_STATUS } from '@subscription-buddy/core'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { t } = useI18n()
const notification = useNotification()

const groupId = route.params.id as string

// Use composable for real-time group data
const { data: group } = useFirestoreDoc<Group>('groups', groupId)

useHead({
  title: computed(() =>
    group.value?.title ? `${group.value.title} | Sub-Buddy` : 'Loading... | Sub-Buddy'
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () => group.value?.description || 'Join this subscription group on Sub-Buddy!'
      )
    },
    {
      property: 'og:title',
      content: computed(() =>
        group.value?.title ? `${group.value.title} | Sub-Buddy` : 'Sub-Buddy Group'
      )
    },
    {
      property: 'og:description',
      content: computed(
        () => group.value?.description || 'Join this subscription group on Sub-Buddy!'
      )
    }
  ]
})

const isHost = computed(() => {
  return group.value && userStore.user && group.value.hostId === userStore.user.uid
})

const formatDate = (timestamp: Date | { seconds: number } | null | undefined) => {
  if (!timestamp) return ''
  if (timestamp instanceof Date) return timestamp.toLocaleDateString()
  if ('seconds' in timestamp) return new Date(timestamp.seconds * 1000).toLocaleDateString()
  return ''
}

const handleDelete = async () => {
  if (!confirm(t('group.detail.confirmDelete'))) return
  if (!group.value || !group.value.id) return
  try {
    await groupStore.deleteGroup(group.value.id)
    router.push('/')
  } catch (err) {
    notification.error(t('group.error.deleteFailed') + ': ' + (err as Error).message)
  }
}

const handleCloseGroup = async () => {
  if (!confirm(t('group.detail.confirmClose'))) return
  if (!group.value || !group.value.id) return
  try {
    await groupStore.updateGroupStatus(group.value.id, GROUP_STATUS.CLOSED)
  } catch (err) {
    notification.error(t('group.error.closeFailed') + ': ' + (err as Error).message)
  }
}
</script>
