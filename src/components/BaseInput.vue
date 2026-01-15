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
        class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
        :class="{ 'pl-8': $slots.prefix }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
      />
    </div>
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
  }
})

defineEmits(['update:modelValue'])
</script>
