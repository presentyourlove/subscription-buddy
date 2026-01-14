import { ref, onMounted } from 'vue'
const accepted = ref(true) // Default to true to prevent flash, check in onMounted
onMounted(() => {
  const isAccepted = localStorage.getItem('cookie_consent')
  if (!isAccepted) {
    accepted.value = false
  }
})
const accept = () => {
  localStorage.setItem('cookie_consent', 'true')
  accepted.value = true
}
const __VLS_ctx = {
  ...{},
  ...{}
}
let __VLS_components
let __VLS_intrinsics
let __VLS_directives
if (!__VLS_ctx.accepted) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{
      class:
        'fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10 p-4 md:p-6 z-50 animate-fade-up'
    }
  })
  /** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['bottom-0']} */ /** @type {__VLS_StyleScopedClasses['left-0']} */ /** @type {__VLS_StyleScopedClasses['right-0']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-900']} */ /** @type {__VLS_StyleScopedClasses['border-t']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['md:p-6']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['animate-fade-up']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4' }
  })
  /** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-col']} */ /** @type {__VLS_StyleScopedClasses['md:flex-row']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-gray-300 text-sm md:text-base text-center md:text-left' }
  })
  /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['md:text-base']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['md:text-left']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p
  )({})
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'flex gap-3' }
  })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button
  )({
    ...{ onClick: __VLS_ctx.accept },
    ...{
      class:
        'bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-medium transition-colors text-sm'
    }
  })
  /** @type {__VLS_StyleScopedClasses['bg-purple-600']} */
  /** @type {__VLS_StyleScopedClasses['hover:bg-purple-500']} */
  /** @type {__VLS_StyleScopedClasses['text-white']} */
  /** @type {__VLS_StyleScopedClasses['px-6']} */
  /** @type {__VLS_StyleScopedClasses['py-2']} */
  /** @type {__VLS_StyleScopedClasses['rounded-full']} */
  /** @type {__VLS_StyleScopedClasses['font-medium']} */
  /** @type {__VLS_StyleScopedClasses['transition-colors']} */
  /** @type {__VLS_StyleScopedClasses['text-sm']} */
}
// @ts-ignore
;[accepted, accept]
const __VLS_export = (await import('vue')).defineComponent({})
export default {}
//# sourceMappingURL=CookieConsent.vue.js.map
