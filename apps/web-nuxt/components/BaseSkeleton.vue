<template>
  <div
    class="bg-white/10 animate-pulse rounded"
    :class="{
      'rounded-full': variant === 'circular',
      'rounded-none': variant === 'rectangular'
    }"
    :style="{
      width,
      height
    }"
  ></div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
    variant?: 'text' | 'circular' | 'rectangular'
  }>(),
  {
    width: '100%',
    height: '1em',
    variant: 'text'
  }
)
</script>
