<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ $t('admin.overview') }}</h2>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium">{{ $t('admin.totalUsers') }}</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">
          <span v-if="loading" class="text-base font-normal">Loading...</span>
          <span v-else>{{ totalUsers }}</span>
        </p>
        <span class="text-green-500 text-sm">↑ {{ $t('admin.stats.fromLastMonth') }}</span>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium">{{ $t('admin.activeGroups') }}</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">
          <span v-if="loading" class="text-base font-normal">Loading...</span>
          <span v-else>{{ totalGroups }}</span>
        </p>
        <span class="text-green-500 text-sm">↑ {{ $t('admin.stats.newToday') }}</span>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium">{{ $t('admin.pendingReports') }}</h3>
        <p class="text-3xl font-bold text-orange-600 mt-2">3</p>
        <span class="text-gray-400 text-sm">{{ $t('admin.stats.needsAttention') }}</span>
      </div>
    </div>

    <!-- Recent Activity Placeholder -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 class="text-lg font-bold mb-4">{{ $t('admin.systemAlerts') }}</h3>
      <div class="p-4 bg-blue-50 text-blue-700 rounded-md">
        {{ $t('admin.systemNormal') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, getCountFromServer, query } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { useFirestore } from 'vuefire'

// Use VueFire to get Firestore instance
const db = useFirestore()

const totalUsers = ref(0)
const totalGroups = ref(0)
const loading = ref(true)

onMounted(async () => {
  if (!db) return // Guard if db not initialized

  loading.value = true
  try {
    // 1. Total Users
    const usersColl = collection(db, 'users')
    const usersSnapshot = await getCountFromServer(usersColl)
    totalUsers.value = usersSnapshot.data().count

    // 2. Active Groups
    const groupsColl = collection(db, 'groups')
    const qOpen = query(groupsColl)
    const groupsSnapshot = await getCountFromServer(qOpen)
    totalGroups.value = groupsSnapshot.data().count
  } catch (err) {
    console.error('Failed to fetch dashboard stats', err)
  } finally {
    loading.value = false
  }
})
</script>
