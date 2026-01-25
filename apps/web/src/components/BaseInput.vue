<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-400 mb-2">{{
      label
    }}</label>
    <div class="relative">
      <span v-if="$slots.prefix" class="absolute left-4 top-3 text-gray-500">
        <slot name="prefix"></slot>
      </span>
      <input
        v-bind="$attrs"
        :id="id"
        :value="modelValue"
        class="w-full bg-black/20 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
        :class="[
          $slots.prefix ? 'pl-8' : '',
          error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-500'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
