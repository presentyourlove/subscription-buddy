const __VLS_props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
})
const __VLS_emit = defineEmits(['update:modelValue'])
const __VLS_ctx = {
  ...{},
  ...{},
  ...{},
  ...{}
}
let __VLS_components
let __VLS_intrinsics
let __VLS_directives
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({})
if (__VLS_ctx.label) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label
  )({
    ...{ class: 'block text-sm font-medium text-gray-400 mb-2' }
  })
  /** @type {__VLS_StyleScopedClasses['block']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['mb-2']} */ __VLS_ctx.label
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.textarea,
  __VLS_intrinsics.textarea
)({
  ...{
    onInput: (...[$event]) => {
      __VLS_ctx.$emit('update:modelValue', $event.target.value)
      // @ts-ignore
      ;[label, label, $emit]
    }
  },
  value: __VLS_ctx.modelValue,
  ...{
    class:
      'w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors'
  }
})
__VLS_ctx.$attrs
/** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ /** @type {__VLS_StyleScopedClasses['focus:border-purple-500']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ // @ts-ignore
;[modelValue, $attrs]
const __VLS_export = (await import('vue')).defineComponent({
  emits: {},
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }
})
export default {}
//# sourceMappingURL=BaseTextarea.vue.js.map
