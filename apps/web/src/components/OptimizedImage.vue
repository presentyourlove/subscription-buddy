<template>
  <picture>
    <!-- AVIF Sources-->
    <source
      v-for="size in sizes"
      :key="`avif-${size}`"
      :srcset="getUrl(size, 'avif')"
      :media="`(max-width: ${size}px)`"
      type="image/avif"
    />
    <!-- WebP Sources -->
    <source
      v-for="size in sizes"
      :key="`webp-${size}`"
      :srcset="getUrl(size, 'webp')"
      :media="`(max-width: ${size}px)`"
      type="image/webp"
    />
    <!-- Fallback Image -->
    <img
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :width="width"
      :height="height"
      class="w-full h-auto object-cover"
      @error="handleError"
    />
  </picture>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  lazy?: boolean
}>(), {
  alt: '',
  lazy: true
})

const sizes = [320, 640, 1024, 1920]

const getUrl = (size: number, format: 'webp' | 'avif') => {
  // Assume URL pattern matches Cloud Function output
  // e.g., input: https://bucket/path/image.jpg
  // output: https://bucket/path/image_320w.webp
  
  if (!props.src) return ''
  
  const extension = props.src.split('.').pop()
  if (!extension) return props.src
  
  const baseUrl = props.src.substring(0, props.src.lastIndexOf('.'))
  return `${baseUrl}_${size}w.${format}`
}

const handleError = (e: Event) => {
  // Fallback logic if optimized image doesn't exist yet
  // Could hide the source or just let the img tag handle it (it will show broken icon or original src if 404 handled)
  // For now, minimal handling.
  console.warn('Image load failed', e)
}
</script>
