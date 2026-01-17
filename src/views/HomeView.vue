<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header Strategy -->
    <div class="text-center mb-12">
      <h1
        class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
      >
        {{ $t('home.heroTitle') }}
      </h1>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto whitespace-pre-line">
        {{ $t('home.heroSubtitle') }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex justify-center mb-8">
      <PrefetchLink
        to="/create"
        class="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-1"
      >
        <span class="mr-2 text-xl">+</span> {{ $t('home.createLink') }}
      </PrefetchLink>
    </div>

    <!-- Search & Filter -->
    <div class="mb-8 relative max-w-xl mx-auto">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-400">🔍</span>
      </div>
      <input
        v-model="groupStore.searchQuery"
        type="text"
        class="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm backdrop-blur-sm transition-all"
        :placeholder="$t('home.searchPlaceholder')"
      />
    </div>

    <!-- Background Refresh Indicator (Optional) -->
    <div v-if="groupStore.loading && groupStore.groups.length > 0" class="flex justify-center mb-4">
      <span class="bg-purple-600/80 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
         <span class="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></span>
         Updating...
      </span>
    </div>

    <!-- Loading State: Skeleton Screen (Only if no data) -->
    <div v-if="groupStore.loading && groupStore.groups.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
      >
        <!-- Icon & Title -->
        <div class="flex items-center gap-4">
          <BaseSkeleton variant="rectangular" width="48px" height="48px" class="rounded-xl" />
          <div class="flex-1">
            <BaseSkeleton width="60%" height="1.5em" class="mb-2" />
            <BaseSkeleton width="40%" height="1em" />
          </div>
        </div>
        <!-- Description -->
        <div class="space-y-2">
          <BaseSkeleton width="100%" />
          <BaseSkeleton width="80%" />
        </div>
        <!-- Footer -->
        <div class="flex justify-between mt-4 pt-4 border-t border-white/10">
          <BaseSkeleton width="30%" />
          <BaseSkeleton width="20%" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="groupStore.error" class="text-center py-12 text-red-400">
      {{ groupStore.error }}
    </div>

    <!-- Group Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          class="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
        >
          <!-- Status Badge -->
          <span
            class="absolute top-4 right-4 px-2 py-1 text-xs rounded-full border"
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

          <!-- Service Icon / Logo -->
          <div class="h-16 mb-4 flex items-center">
            <img
              v-if="group.id && getServiceLogo(group.title) && !imageErrorMap[group.id]"
              :src="getServiceLogo(group.title)"
              class="h-full max-w-[50%] object-contain"
              alt="Service Logo"
              @error="handleImageError(group.id)"
            />
            <div
              v-else
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30"
            >
              📺
            </div>
          </div>

          <h3 class="text-xl font-bold text-white mb-2">{{ group.title }}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{{ group.description }}</p>

          <div class="flex items-center justify-between text-sm py-3 border-t border-white/10">
            <div class="flex flex-col">
              <span class="text-gray-500">{{ $t('home.card.pricePerMonth') }}</span>
              <span class="font-bold text-purple-300 text-lg"
                >${{ group.price }}
                <span class="text-xs text-gray-500">{{ $t('home.card.month') }}</span></span
              >
            </div>
            <div class="flex flex-col items-end">
              <span class="text-gray-500">{{ $t('home.card.slots') }}</span>
              <span class="font-bold text-white"
                >{{ group.slots }} {{ $t('home.card.people') }}</span
              >
            </div>
          </div>

          <!-- Host Info -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs overflow-hidden"
              >
                <LazyImage
                  v-if="group.hostAvatar"
                  :src="group.hostAvatar"
                  image-class="w-full h-full object-cover"
                  container-class="w-full h-full"
                  :show-placeholder="false"
                />
                <span v-else>👤</span>
              </div>
              <span class="text-xs text-gray-400 flex items-center gap-1">
                {{ group.hostName || $t('home.card.anonymous') }}
                <UserRating :uid="group.hostId" />
              </span>
            </div>
            <PrefetchLink
              :to="'/groups/' + group.id"
              class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-colors"
            >
              {{ $t('home.card.details') }}
            </PrefetchLink>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div
        v-if="groupStore.hasMore && !searchQuery && !debouncedQuery"
        class="flex justify-center mt-12"
      >
        <button
          :disabled="groupStore.loading"
          class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors flex items-center gap-2"
          @click="groupStore.fetchNextPage()"
        >
          <span
            v-if="groupStore.loading"
            class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
          ></span>
          {{ groupStore.loading ? '載入中...' : '載入更多' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!groupStore.loading && filteredGroups.length === 0" class="text-center py-20">
      <p class="text-gray-500 text-lg">{{ $t('home.emptyState') }}</p>
      <PrefetchLink
        to="/create"
        class="inline-block mt-4 text-purple-400 hover:text-purple-300 font-medium"
      >
        + {{ $t('home.createLink') }}
      </PrefetchLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'

import BaseSkeleton from '../components/BaseSkeleton.vue'
import LazyImage from '../components/LazyImage.vue'
import PrefetchLink from '../components/PrefetchLink.vue'
import UserRating from '../components/UserRating.vue'
import { useFuzzySearch } from '../composables/useFuzzySearch'
import { useGroupStore } from '../stores/groupStore'
import { GROUP_STATUS } from '../utils/constants'
import { getServiceLogo } from '../utils/serviceUtils'

const groupStore = useGroupStore()
const imageErrorMap = ref<Record<string, boolean>>({})

// Fuzzy Search Setup
const { searchTerm, results: searchResults } = useFuzzySearch(
  computed(() => groupStore.groups),
  {
    keys: [
      { name: 'title', weight: 1.0 }, // Higher weight for title
      { name: 'description', weight: 0.5 },
      { name: 'hostName', weight: 0.3 }
    ],
    threshold: 0.3
  }
)

// Sync store search query with local fuse search term
watch(
  () => groupStore.searchQuery,
  (val) => {
    searchTerm.value = val
  },
  { immediate: true }
)

// Debounced search query update for UI responsiveness
// Removed local ref, using store directly via v-model


onMounted(() => {
  groupStore.fetchGroups()
})

// ... (omitted middle part if contiguous it's fine, but here startLine 154) ...
// Actually I need to split this replacement or just replace the block I verify.
// I will replace imageErrorMap init at 154 and handleImageError at 185 separately?
// Or just replace the ref definition first.

/* Correct logic: */
// I will just replace the ref line.

onMounted(() => {
  groupStore.fetchGroups()
})

const filteredGroups = computed(() => {
  // 1. Fuzzy Search Results
  // The composable returns all data if searchTerm is empty.
  let result = searchResults.value

  // 2. Sort by Status (OPEN -> FULL -> CLOSED)
  const statusWeight = {
    [GROUP_STATUS.OPEN]: 1,
    [GROUP_STATUS.FULL]: 2,
    [GROUP_STATUS.CLOSED]: 3
  }

  return result.sort((a, b) => {
    const wA = statusWeight[a.status] || 99 // Default to end if unknown
    const wB = statusWeight[b.status] || 99
    return wA - wB
  })
})

const handleImageError = (id: string | number | undefined) => {
  if (id) imageErrorMap.value[String(id)] = true
}
</script>
