<template>
  <div class="relative" :class="containerClass">
    <!-- Loading placeholder -->
    <div
      v-if="isLoading && showPlaceholder"
      class="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-full flex items-center justify-center"
    >
      <span v-if="placeholderIcon" class="text-gray-500">{{ placeholderIcon }}</span>
    </div>

    <!-- Actual image -->
    <img
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      loading="lazy"
      :class="[imageClass, { 'opacity-0': isLoading, 'opacity-100': !isLoading }]"
      class="transition-opacity duration-300"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  src: string | null | undefined
  alt?: string
  fallbackSrc?: string
  placeholderIcon?: string
  showPlaceholder?: boolean
  imageClass?: string
  containerClass?: string
  width?: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fallbackSrc: '',
  placeholderIcon: '👤',
  showPlaceholder: true,
  imageClass: '',
  containerClass: ''
})

const imageRef = ref<HTMLImageElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)

import { optimizeImage } from '../utils/imageOptimizer'

const currentSrc = computed(() => {
  if (hasError.value && props.fallbackSrc) {
    return props.fallbackSrc
  }
  return optimizeImage(props.src, props.width)
})

const handleLoad = () => {
  isLoading.value = false
}

const handleError = () => {
  hasError.value = true
  isLoading.value = false
}

// Reset loading state when src changes
watch(
  () => props.src,
  () => {
    if (props.src) {
      isLoading.value = true
      hasError.value = false
    }
  }
)
</script>
