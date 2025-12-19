<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-400 mb-2">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :value="modelValue"
      class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
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
  }
})

defineEmits(['update:modelValue'])
</script>
