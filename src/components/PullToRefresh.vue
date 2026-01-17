<template>
  <div
    ref="container"
    class="relative touch-pan-y"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Loading Indicator -->
    <div
      class="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none transition-transform duration-200"
      :style="{ transform: `translateY(${translateY - 50}px)` }"
    >
      <div class="bg-white/10 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/10">
        <svg
          v-if="isRefreshing"
          class="animate-spin h-6 w-6 text-purple-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg
          v-else
          class="h-6 w-6 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': translateY > threshold }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div
      class="transition-transform duration-200 ease-out will-change-transform"
      :style="{ transform: `translateY(${translateY}px)` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  onRefresh: () => Promise<void>
}>()

const container = ref<HTMLElement | null>(null)
const translateY = ref(0)
const isRefreshing = ref(false)
const startY = ref(0)
const threshold = 80 // Pull threshold to trigger refresh

const handleTouchStart = (e: TouchEvent) => {
  if (window.scrollY === 0) {
    startY.value = e.touches[0].clientY
  }
}

const handleTouchMove = (e: TouchEvent) => {
  const currentY = e.touches[0].clientY
  const diff = currentY - startY.value

  // Only pull if at top and pulling down
  if (window.scrollY === 0 && diff > 0 && !isRefreshing.value) {
    // Add resistance (logarithmic or simple division)
    translateY.value = Math.pow(diff, 0.8) // Smooth resistance

    // Prevent default to stop rubber-banding if browser supports generic passive: false
    // Note: In modern browsers, touchmove is passive by default, so e.preventDefault() might be ignored
    // or cause warnings. We rely on 'touch-pan-y' css helper.
  }
}

const handleTouchEnd = async () => {
  if (isRefreshing.value) return

  if (translateY.value > threshold) {
    isRefreshing.value = true
    translateY.value = 50 // Keep it visible while loading

    try {
      await props.onRefresh()
    } finally {
      isRefreshing.value = false
      translateY.value = 0
    }
  } else {
    translateY.value = 0
  }
}
</script>
