import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CookieConsent from './components/CookieConsent.vue'
import { useUserStore } from './stores/userStore'
import { onMounted } from 'vue'
const userStore = useUserStore()
onMounted(() => {
  userStore.initAuth()
})
const __VLS_ctx = {
  ...{},
  ...{}
}
let __VLS_components
let __VLS_intrinsics
let __VLS_directives
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{
    class:
      'min-h-screen bg-[#0f172a] text-white font-sans selection:bg-purple-500 selection:text-white'
  }
})
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ /** @type {__VLS_StyleScopedClasses['bg-[#0f172a]']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['font-sans']} */ /** @type {__VLS_StyleScopedClasses['selection:bg-purple-500']} */ /** @type {__VLS_StyleScopedClasses['selection:text-white']} */ const __VLS_0 =
  Navbar
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}))
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1))
if (__VLS_ctx.userStore.authReady) {
  __VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({})
  let __VLS_5
  /** @ts-ignore @type {typeof __VLS_components.routerView | typeof __VLS_components.RouterView} */
  routerView
  // @ts-ignore
  const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}))
  const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6))
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'h-screen flex items-center justify-center' }
  })
  /** @type {__VLS_StyleScopedClasses['h-screen']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500' }
  })
  /** @type {__VLS_StyleScopedClasses['animate-spin']} */
  /** @type {__VLS_StyleScopedClasses['rounded-full']} */
  /** @type {__VLS_StyleScopedClasses['h-12']} */
  /** @type {__VLS_StyleScopedClasses['w-12']} */
  /** @type {__VLS_StyleScopedClasses['border-t-2']} */
  /** @type {__VLS_StyleScopedClasses['border-b-2']} */
  /** @type {__VLS_StyleScopedClasses['border-purple-500']} */
}
const __VLS_10 = CookieConsent
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}))
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11))
const __VLS_15 = Footer
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}))
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16))
// @ts-ignore
;[userStore]
const __VLS_export = (await import('vue')).defineComponent({})
export default {}
//# sourceMappingURL=App.vue.js.map
