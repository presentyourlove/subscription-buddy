import { ref, onMounted, computed } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
const props = defineProps({
  uid: {
    type: String,
    required: true
  }
})
const loading = ref(true)
const ratingSum = ref(0)
const ratingCount = ref(0)
const score = computed(() => {
  if (ratingCount.value === 0) return 0
  return (ratingSum.value / ratingCount.value).toFixed(1)
})
onMounted(async () => {
  if (!props.uid) return
  try {
    const docRef = doc(db, 'users', props.uid)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      const data = snap.data()
      ratingSum.value = data.ratingSum || 0
      ratingCount.value = data.ratingCount || 0
    }
  } catch (e) {
    console.error('Fetch rating error', e)
  } finally {
    loading.value = false
  }
})
const __VLS_ctx = {
  ...{},
  ...{},
  ...{},
  ...{}
}
let __VLS_components
let __VLS_intrinsics
let __VLS_directives
if (__VLS_ctx.loading) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-xs text-gray-500 animate-pulse' }
  })
  /** @type {__VLS_StyleScopedClasses['text-xs']} */
  /** @type {__VLS_StyleScopedClasses['text-gray-500']} */
  /** @type {__VLS_StyleScopedClasses['animate-pulse']} */
} else if (__VLS_ctx.ratingCount > 0) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'flex items-center gap-1 text-yellow-400 font-medium' }
  })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-1']} */ /** @type {__VLS_StyleScopedClasses['text-yellow-400']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-[10px]' }
  })
  /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ __VLS_ctx.score
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-gray-500 text-[10px]' }
  })
  /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ __VLS_ctx.ratingCount
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-xs text-gray-500' }
  })
  /** @type {__VLS_StyleScopedClasses['text-xs']} */
  /** @type {__VLS_StyleScopedClasses['text-gray-500']} */
}
// @ts-ignore
;[loading, ratingCount, ratingCount, score]
const __VLS_export = (await import('vue')).defineComponent({
  props: {
    uid: {
      type: String,
      required: true
    }
  }
})
export default {}
//# sourceMappingURL=UserRating.vue.js.map
