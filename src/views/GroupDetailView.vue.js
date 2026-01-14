import { computed, onMounted, onUnmounted, ref } from 'vue' // Add onUnmounted
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import UserRating from '../components/UserRating.vue'
import { GROUP_STATUS } from '../utils/constants'
import { useI18n } from 'vue-i18n'
const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()
const { t } = useI18n()
const group = ref(null)
// showDebug removed
let unsubscribe = null
onMounted(async () => {
  const id = route.params.id
  // Real-time listener
  unsubscribe = onSnapshot(doc(db, 'groups', id), (doc) => {
    if (doc.exists()) {
      group.value = { id: doc.id, ...doc.data() }
    } else {
      group.value = null
    }
  })
})
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
const isHost = computed(() => {
  return group.value && userStore.user && group.value.hostId === userStore.user.uid
})
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}
const handleDelete = async () => {
  if (!confirm(t('group.detail.confirmDelete'))) return
  if (!group.value) return
  try {
    await groupStore.deleteGroup(group.value.id)
    router.push('/')
  } catch (err) {
    alert(t('group.error.deleteFailed') + ': ' + err.message)
  }
}
const handleCloseGroup = async () => {
  if (!confirm(t('group.detail.confirmClose'))) return
  if (!group.value) return
  try {
    await groupStore.updateGroupStatus(group.value.id, GROUP_STATUS.CLOSED)
  } catch (err) {
    alert(t('group.error.closeFailed') + ': ' + err.message)
  }
}
const __VLS_ctx = {
  ...{},
  ...{}
}
let __VLS_components
let __VLS_intrinsics
let __VLS_directives
if (__VLS_ctx.group) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'max-w-4xl mx-auto px-4 py-8' }
  })
  /** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-8']} */ let __VLS_0
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent1(
    __VLS_0,
    new __VLS_0({
      to: '/',
      ...{ class: 'inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors' }
    })
  )
  const __VLS_2 = __VLS_1(
    {
      to: '/',
      ...{ class: 'inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors' }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1)
  )
  /** @type {__VLS_StyleScopedClasses['inline-flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-6']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ const {
    default: __VLS_5
  } = __VLS_3.slots
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'mr-2' }
  })
  /** @type {__VLS_StyleScopedClasses['mr-2']} */ __VLS_ctx.$t('group.detail.back')
  // @ts-ignore
  ;[group, $t]
  var __VLS_3
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl' }
  })
  /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ /** @type {__VLS_StyleScopedClasses['p-8']} */ /** @type {__VLS_StyleScopedClasses['shadow-xl']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4' }
  })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-col']} */ /** @type {__VLS_StyleScopedClasses['md:flex-row']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['items-start']} */ /** @type {__VLS_StyleScopedClasses['md:items-center']} */ /** @type {__VLS_StyleScopedClasses['mb-8']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({})
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.h1,
    __VLS_intrinsics.h1
  )({
    ...{ class: 'text-3xl font-bold text-white mb-2 flex items-center gap-3' }
  })
  /** @type {__VLS_StyleScopedClasses['text-3xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-2']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ __VLS_ctx
    .group.title
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'px-3 py-1 text-sm rounded-full border' },
    ...{
      class: {
        'bg-green-500/20 text-green-300 border-green-500/30':
          __VLS_ctx.group.status === __VLS_ctx.GROUP_STATUS.OPEN,
        'bg-gray-500/20 text-gray-300 border-gray-500/30':
          __VLS_ctx.group.status === __VLS_ctx.GROUP_STATUS.CLOSED,
        'bg-red-500/20 text-red-300 border-red-500/30':
          __VLS_ctx.group.status === __VLS_ctx.GROUP_STATUS.FULL
      }
    }
  })
  /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-1']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['bg-green-500/20']} */ /** @type {__VLS_StyleScopedClasses['text-green-300']} */ /** @type {__VLS_StyleScopedClasses['border-green-500/30']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-500/20']} */ /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ /** @type {__VLS_StyleScopedClasses['border-gray-500/30']} */ /** @type {__VLS_StyleScopedClasses['bg-red-500/20']} */ /** @type {__VLS_StyleScopedClasses['text-red-300']} */ /** @type {__VLS_StyleScopedClasses['border-red-500/30']} */ __VLS_ctx.$t(
    `group.status.${__VLS_ctx.group.status}`
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'flex items-center text-gray-400 text-sm gap-4' }
  })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'flex items-center gap-2' }
  })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ __VLS_ctx.$t(
    'group.detail.host'
  )
  __VLS_ctx.group.hostName
  const __VLS_6 = UserRating
  // @ts-ignore
  const __VLS_7 = __VLS_asFunctionalComponent1(
    __VLS_6,
    new __VLS_6({
      uid: __VLS_ctx.group.hostId
    })
  )
  const __VLS_8 = __VLS_7(
    {
      uid: __VLS_ctx.group.hostId
    },
    ...__VLS_functionalComponentArgsRest(__VLS_7)
  )
  __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({})
  __VLS_ctx.$t('group.detail.postedAt')
  __VLS_ctx.formatDate(__VLS_ctx.group.createdAt)
  if (__VLS_ctx.isHost) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'flex gap-3' }
    })
    /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ if (
      __VLS_ctx.group.status !== __VLS_ctx.GROUP_STATUS.CLOSED
    ) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button
      )({
        ...{ onClick: __VLS_ctx.handleCloseGroup },
        ...{
          class:
            'px-4 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border border-gray-500/20 rounded-lg transition-colors text-sm font-medium'
        }
      })
      /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-500/10']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-gray-500/20']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-gray-500/20']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ __VLS_ctx.$t(
        'group.detail.manualClose'
      )
    }
    if (__VLS_ctx.group.status !== __VLS_ctx.GROUP_STATUS.CLOSED) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button
      )({
        ...{ onClick: __VLS_ctx.handleDelete },
        ...{
          class:
            'px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors text-sm font-medium'
        }
      })
      /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['bg-red-500/10']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-red-500/20']} */ /** @type {__VLS_StyleScopedClasses['text-red-400']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-red-500/20']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ __VLS_ctx.$t(
        'group.detail.deleteGroup'
      )
    }
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' }
  })
  /** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ /** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ /** @type {__VLS_StyleScopedClasses['gap-6']} */ /** @type {__VLS_StyleScopedClasses['mb-8']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'bg-black/20 rounded-xl p-4 border border-white/5' }
  })
  /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/5']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-gray-500 text-sm mb-1' }
  })
  /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['mb-1']} */ __VLS_ctx.$t(
    'group.detail.pricePerMonth'
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-2xl font-bold text-purple-300' }
  })
  /** @type {__VLS_StyleScopedClasses['text-2xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-purple-300']} */ __VLS_ctx
    .group.price
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-sm text-gray-500' }
  })
  /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ __VLS_ctx.$t(
    'home.card.month'
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'bg-black/20 rounded-xl p-4 border border-white/5' }
  })
  /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/5']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-gray-500 text-sm mb-1' }
  })
  /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['mb-1']} */ __VLS_ctx.$t(
    'group.detail.slotsLeft'
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-2xl font-bold text-white' }
  })
  /** @type {__VLS_StyleScopedClasses['text-2xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ __VLS_ctx
    .group.slots
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-sm text-gray-500' }
  })
  /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ __VLS_ctx.$t(
    'home.card.people'
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'bg-black/20 rounded-xl p-4 border border-white/5' }
  })
  /** @type {__VLS_StyleScopedClasses['bg-black/20']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/5']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-gray-500 text-sm mb-1' }
  })
  /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['mb-1']} */ __VLS_ctx.$t(
    'group.detail.paymentMethod'
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-lg font-medium text-gray-300' }
  })
  /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ __VLS_ctx.$t(
    'group.detail.paymentMethodValue'
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'mb-8' }
  })
  /** @type {__VLS_StyleScopedClasses['mb-8']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h3,
    __VLS_intrinsics.h3
  )({
    ...{ class: 'text-lg font-medium text-white mb-3' }
  })
  /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-3']} */ __VLS_ctx.$t(
    'group.detail.description'
  )
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p
  )({
    ...{
      class:
        'text-gray-300 whitespace-pre-line leading-relaxed bg-black/10 p-4 rounded-xl border border-white/5'
    }
  })
  /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ /** @type {__VLS_StyleScopedClasses['whitespace-pre-line']} */ /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ /** @type {__VLS_StyleScopedClasses['bg-black/10']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/5']} */ __VLS_ctx
    .group.description
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'pt-8 border-t border-white/10' }
  })
  /** @type {__VLS_StyleScopedClasses['pt-8']} */ /** @type {__VLS_StyleScopedClasses['border-t']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ if (
    __VLS_ctx.isHost ||
    __VLS_ctx.group.status === __VLS_ctx.GROUP_STATUS.CLOSED
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div
    )({
      ...{ class: 'flex flex-col gap-4' }
    })
    /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-col']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ let __VLS_11
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(
      __VLS_11,
      new __VLS_11({
        to: `/chat/${__VLS_ctx.group.id}`,
        ...{
          class:
            'block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1'
        }
      })
    )
    const __VLS_13 = __VLS_12(
      {
        to: `/chat/${__VLS_ctx.group.id}`,
        ...{
          class:
            'block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1'
        }
      },
      ...__VLS_functionalComponentArgsRest(__VLS_12)
    )
    /** @type {__VLS_StyleScopedClasses['block']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ /** @type {__VLS_StyleScopedClasses['from-purple-600']} */ /** @type {__VLS_StyleScopedClasses['to-pink-600']} */ /** @type {__VLS_StyleScopedClasses['hover:from-purple-500']} */ /** @type {__VLS_StyleScopedClasses['hover:to-pink-500']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['py-4']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-purple-500/30']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['transform']} */ /** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ const {
      default: __VLS_16
    } = __VLS_14.slots
    __VLS_ctx.$t('group.detail.enterChat')
    __VLS_ctx.isHost
      ? __VLS_ctx.$t('group.detail.hostRole')
      : __VLS_ctx.$t('group.detail.closedRole')
    // @ts-ignore
    ;[
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      group,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      $t,
      GROUP_STATUS,
      GROUP_STATUS,
      GROUP_STATUS,
      GROUP_STATUS,
      GROUP_STATUS,
      GROUP_STATUS,
      formatDate,
      isHost,
      isHost,
      isHost,
      handleCloseGroup,
      handleDelete
    ]
    var __VLS_14
    if (__VLS_ctx.isHost) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div
      )({
        ...{ class: 'text-center text-gray-400 text-sm' }
      })
      /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ __VLS_ctx.$t(
        'group.detail.hostHint'
      )
    }
  } else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({})
    if (__VLS_ctx.group.status === __VLS_ctx.GROUP_STATUS.OPEN) {
      let __VLS_17
      /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
      routerLink
      // @ts-ignore
      const __VLS_18 = __VLS_asFunctionalComponent1(
        __VLS_17,
        new __VLS_17({
          to: `/chat/${__VLS_ctx.group.id}`,
          ...{
            class:
              'block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1'
          }
        })
      )
      const __VLS_19 = __VLS_18(
        {
          to: `/chat/${__VLS_ctx.group.id}`,
          ...{
            class:
              'block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1'
          }
        },
        ...__VLS_functionalComponentArgsRest(__VLS_18)
      )
      /** @type {__VLS_StyleScopedClasses['block']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ /** @type {__VLS_StyleScopedClasses['from-purple-600']} */ /** @type {__VLS_StyleScopedClasses['to-pink-600']} */ /** @type {__VLS_StyleScopedClasses['hover:from-purple-500']} */ /** @type {__VLS_StyleScopedClasses['hover:to-pink-500']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['py-4']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-purple-500/30']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['transform']} */ /** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ const {
        default: __VLS_22
      } = __VLS_20.slots
      __VLS_ctx.$t('group.detail.applyJoin')
      // @ts-ignore
      ;[group, group, $t, $t, GROUP_STATUS, isHost]
      var __VLS_20
    } else {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button
      )({
        disabled: true,
        ...{
          class: 'w-full bg-gray-600 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed'
        }
      })
      /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-600']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['py-4']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['cursor-not-allowed']} */ __VLS_ctx.$t(
        'group.detail.full'
      )
    }
  }
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div
  )({
    ...{ class: 'text-center py-20 text-gray-500' }
  })
  /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['py-20']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ __VLS_ctx.$t(
    'group.detail.loading'
  )
}
// @ts-ignore
;[$t, $t]
const __VLS_export = (await import('vue')).defineComponent({})
export default {}
//# sourceMappingURL=GroupDetailView.vue.js.map
