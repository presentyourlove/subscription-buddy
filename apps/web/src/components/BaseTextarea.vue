<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-400 mb-2">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :value="modelValue"
      class="w-full bg-black/20 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
      :class="
        error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-500'
      "
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <p v-if="error" class="mt-1 text-sm text-red-400">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
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
