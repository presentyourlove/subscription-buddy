const __VLS_props = defineProps({
  modelValue: {
    type: [String, Number],
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
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'relative' }
})
/** @type {__VLS_StyleScopedClasses['relative']} */ if (__VLS_ctx.$slots.prefix) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'absolute left-4 top-3 text-gray-500' }
  })
  /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['left-4']} */ /** @type {__VLS_StyleScopedClasses['top-3']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ var __VLS_0 =
    {}
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
  ...{
    onInput: (...[$event]) => {
      __VLS_ctx.$emit('update:modelValue', $event.target.value)
      // @ts-ignore
      ;[label, label, $slots, $emit]
    }
  },
  value: __VLS_ctx.modelValue,
  ...{
    class:
      'w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors'
  },
  ...{ class: { 'pl-8': __VLS_ctx.$slots.prefix } }
})
__VLS_ctx.$attrs
/** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ /** @type {__VLS_StyleScopedClasses['focus:border-purple-500']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['pl-8']} */ // @ts-ignore
var __VLS_1 = __VLS_0
// @ts-ignore
;[$slots, modelValue, $attrs]
const __VLS_base = (await import('vue')).defineComponent({
  emits: {},
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }
})
const __VLS_export = {}
export default {}
//# sourceMappingURL=BaseInput.vue.js.map
