<template>
  <span v-if="loading" class="text-xs text-gray-500 animate-pulse">...</span>
  <span v-else-if="ratingCount > 0" class="flex items-center gap-1 text-yellow-400 font-medium">
    <span class="text-[10px]">⭐</span>
    {{ score }}
    <span class="text-gray-500 text-[10px]">({{ ratingCount }})</span>
  </span>
  <span v-else class="text-xs text-gray-500"> (無評價) </span>
</template>

<script setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'

import { db } from '../firebase/config'

const props = defineProps({
  uid: {
    type: String,
    required: false,
    default: ''
  },
  initialData: {
    type: Object, // { ratingSum: number, ratingCount: number }
    default: null
  }
})

const loading = ref(true)
const ratingSum = ref(0)
const ratingCount = ref(0)

const score = computed(() => {
  if (ratingCount.value === 0) return 0
  return (ratingSum.value / ratingCount.value).toFixed(1)
})

onMounted(async () => {
  if (props.initialData) {
    ratingSum.value = props.initialData.ratingSum || 0
    ratingCount.value = props.initialData.ratingCount || 0
    loading.value = false
    return
  }
  if (!props.uid) {
    loading.value = false
    return
  }
  try {
    const docRef = doc(db, 'users', props.uid)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      const data = snap.data()
      ratingSum.value = data.ratingSum || 0
      ratingCount.value = data.ratingCount || 0
    }
  } catch (e) {
    console.error('Fetch rating error', e)
  } finally {
    loading.value = false
  }
})
</script>
