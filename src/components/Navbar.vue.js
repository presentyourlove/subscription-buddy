import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const isOpen = ref(false)
const handleLogout = async () => {
  isOpen.value = false
  await userStore.logout()
  router.push('/')
}
const __VLS_ctx = {
  ...{},
  ...{}
}
let __VLS_components
let __VLS_intrinsics
let __VLS_directives
__VLS_asFunctionalElement1(
  __VLS_intrinsics.nav,
  __VLS_intrinsics.nav
)({
  ...{
    class: 'sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/10 shadow-lg'
  }
})
/** @type {__VLS_StyleScopedClasses['sticky']} */ /** @type {__VLS_StyleScopedClasses['top-0']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ /** @type {__VLS_StyleScopedClasses['bg-[#0f172a]/80']} */ /** @type {__VLS_StyleScopedClasses['border-b']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' }
})
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['sm:px-6']} */ /** @type {__VLS_StyleScopedClasses['lg:px-8']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'flex items-center justify-between h-16' }
})
/** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['h-16']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'flex-shrink-0' }
})
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ let __VLS_0
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(
  __VLS_0,
  new __VLS_0({
    to: '/',
    ...{ class: 'flex items-center gap-2' }
  })
)
const __VLS_2 = __VLS_1(
  {
    to: '/',
    ...{ class: 'flex items-center gap-2' }
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1)
)
/** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ const {
  default: __VLS_5
} = __VLS_3.slots
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
  src: '/icon.png',
  ...{ class: 'w-8 h-8 object-contain' },
  alt: 'Logo'
})
/** @type {__VLS_StyleScopedClasses['w-8']} */ /** @type {__VLS_StyleScopedClasses['h-8']} */ /** @type {__VLS_StyleScopedClasses['object-contain']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span
)({
  ...{
    class:
      'font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'
  }
})
/** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-xl']} */ /** @type {__VLS_StyleScopedClasses['tracking-tight']} */ /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ /** @type {__VLS_StyleScopedClasses['from-purple-400']} */ /** @type {__VLS_StyleScopedClasses['to-pink-500']} */ /** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ /** @type {__VLS_StyleScopedClasses['text-transparent']} */ __VLS_ctx.$t(
  'app.title'
)
// @ts-ignore
;[$t]
var __VLS_3
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'hidden md:block' }
})
/** @type {__VLS_StyleScopedClasses['hidden']} */ /** @type {__VLS_StyleScopedClasses['md:block']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'ml-10 flex items-baseline space-x-4' }
})
/** @type {__VLS_StyleScopedClasses['ml-10']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-baseline']} */ /** @type {__VLS_StyleScopedClasses['space-x-4']} */ let __VLS_6
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(
  __VLS_6,
  new __VLS_6({
    to: '/',
    ...{ class: 'hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors' }
  })
)
const __VLS_8 = __VLS_7(
  {
    to: '/',
    ...{ class: 'hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors' }
  },
  ...__VLS_functionalComponentArgsRest(__VLS_7)
)
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ const {
  default: __VLS_11
} = __VLS_9.slots
__VLS_ctx.$t('nav.bulletin')
// @ts-ignore
;[$t]
var __VLS_9
if (__VLS_ctx.userStore.user) {
  let __VLS_12
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_13 = __VLS_asFunctionalComponent1(
    __VLS_12,
    new __VLS_12({
      to: '/create',
      ...{
        class:
          'group relative inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5'
      }
    })
  )
  const __VLS_14 = __VLS_13(
    {
      to: '/create',
      ...{
        class:
          'group relative inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5'
      }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_13)
  )
  /** @type {__VLS_StyleScopedClasses['group']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['inline-flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['px-6']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['duration-200']} */ /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ /** @type {__VLS_StyleScopedClasses['from-purple-600']} */ /** @type {__VLS_StyleScopedClasses['to-pink-600']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['hover:from-purple-500']} */ /** @type {__VLS_StyleScopedClasses['hover:to-pink-500']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-purple-500/30']} */ /** @type {__VLS_StyleScopedClasses['hover:shadow-purple-500/40']} */ /** @type {__VLS_StyleScopedClasses['hover:-translate-y-0.5']} */ const {
    default: __VLS_17
  } = __VLS_15.slots
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'mr-1 text-lg' }
  })
  /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ __VLS_ctx.$t(
    'nav.createGroup'
  )
  // @ts-ignore
  ;[$t, userStore]
  var __VLS_15
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button
  )({
    ...{ onClick: __VLS_ctx.handleLogout },
    ...{ class: 'hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium text-gray-300' }
  })
  /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ __VLS_ctx.$t(
    'nav.logout'
  )
  let __VLS_18
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_19 = __VLS_asFunctionalComponent1(
    __VLS_18,
    new __VLS_18({
      to: '/profile',
      ...{
        class: 'flex items-center gap-2 ml-4 hover:bg-white/10 p-2 rounded-lg transition-colors'
      }
    })
  )
  const __VLS_20 = __VLS_19(
    {
      to: '/profile',
      ...{
        class: 'flex items-center gap-2 ml-4 hover:bg-white/10 p-2 rounded-lg transition-colors'
      }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_19)
  )
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['ml-4']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ const {
    default: __VLS_23
  } = __VLS_21.slots
  if (__VLS_ctx.userStore.user.photoURL) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
      src: __VLS_ctx.userStore.user.photoURL,
      ...{ class: 'w-8 h-8 rounded-full border border-white/20' },
      alt: 'Avatar'
    })
    /** @type {__VLS_StyleScopedClasses['w-8']} */
    /** @type {__VLS_StyleScopedClasses['h-8']} */
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */
    /** @type {__VLS_StyleScopedClasses['border']} */
    /** @type {__VLS_StyleScopedClasses['border-white/20']} */
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-xs text-gray-400' }
  })
  /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ __VLS_ctx
    .userStore.user.displayName
  // @ts-ignore
  ;[$t, userStore, userStore, userStore, handleLogout]
  var __VLS_21
} else {
  let __VLS_24
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_25 = __VLS_asFunctionalComponent1(
    __VLS_24,
    new __VLS_24({
      to: '/login',
      ...{
        class:
          'bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10'
      }
    })
  )
  const __VLS_26 = __VLS_25(
    {
      to: '/login',
      ...{
        class:
          'bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10'
      }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_25)
  )
  /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ const {
    default: __VLS_29
  } = __VLS_27.slots
  __VLS_ctx.$t('nav.login')
  // @ts-ignore
  ;[$t]
  var __VLS_27
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: '-mr-2 flex md:hidden' }
})
/** @type {__VLS_StyleScopedClasses['-mr-2']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['md:hidden']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button
)({
  ...{
    onClick: (...[$event]) => {
      __VLS_ctx.isOpen = !__VLS_ctx.isOpen
      // @ts-ignore
      ;[isOpen, isOpen]
    }
  },
  ...{
    class:
      'bg-white/5 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none'
  }
})
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['inline-flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span
)({
  ...{ class: 'sr-only' }
})
/** @type {__VLS_StyleScopedClasses['sr-only']} */ if (!__VLS_ctx.isOpen) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.svg,
    __VLS_intrinsics.svg
  )({
    ...{ class: 'h-6 w-6' },
    stroke: 'currentColor',
    fill: 'none',
    viewBox: '0 0 24 24'
  })
  /** @type {__VLS_StyleScopedClasses['h-6']} */ /** @type {__VLS_StyleScopedClasses['w-6']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.path
  )({
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M4 6h16M4 12h16M4 18h16'
  })
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.svg,
    __VLS_intrinsics.svg
  )({
    ...{ class: 'h-6 w-6' },
    stroke: 'currentColor',
    fill: 'none',
    viewBox: '0 0 24 24'
  })
  /** @type {__VLS_StyleScopedClasses['h-6']} */ /** @type {__VLS_StyleScopedClasses['w-6']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.path
  )({
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M6 18L18 6M6 6l12 12'
  })
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'md:hidden border-t border-white/10 bg-[#0f172a]' }
})
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.isOpen },
  null,
  null
)
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ /** @type {__VLS_StyleScopedClasses['border-t']} */ /** @type {__VLS_StyleScopedClasses['border-white/10']} */ /** @type {__VLS_StyleScopedClasses['bg-[#0f172a]']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div
)({
  ...{ class: 'px-2 pt-2 pb-3 space-y-1 sm:px-3' }
})
/** @type {__VLS_StyleScopedClasses['px-2']} */ /** @type {__VLS_StyleScopedClasses['pt-2']} */ /** @type {__VLS_StyleScopedClasses['pb-3']} */ /** @type {__VLS_StyleScopedClasses['space-y-1']} */ /** @type {__VLS_StyleScopedClasses['sm:px-3']} */ let __VLS_30
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(
  __VLS_30,
  new __VLS_30({
    ...{ onClick: {} },
    to: '/',
    ...{
      class:
        'text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
    }
  })
)
const __VLS_32 = __VLS_31(
  {
    ...{ onClick: {} },
    to: '/',
    ...{
      class:
        'text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
    }
  },
  ...__VLS_functionalComponentArgsRest(__VLS_31)
)
let __VLS_35
const __VLS_36 =
  ({ click: {} },
  {
    onClick: (...[$event]) => {
      __VLS_ctx.isOpen = false
      // @ts-ignore
      ;[isOpen, isOpen, isOpen]
    }
  })
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['block']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ const {
  default: __VLS_37
} = __VLS_33.slots
__VLS_ctx.$t('nav.bulletin')
// @ts-ignore
;[$t]
var __VLS_33
var __VLS_34
if (__VLS_ctx.userStore.user) {
  let __VLS_38
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_39 = __VLS_asFunctionalComponent1(
    __VLS_38,
    new __VLS_38({
      ...{ onClick: {} },
      to: '/profile',
      ...{
        class: 'flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition-colors'
      }
    })
  )
  const __VLS_40 = __VLS_39(
    {
      ...{ onClick: {} },
      to: '/profile',
      ...{
        class: 'flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition-colors'
      }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_39)
  )
  let __VLS_43
  const __VLS_44 =
    ({ click: {} },
    {
      onClick: (...[$event]) => {
        if (!__VLS_ctx.userStore.user) return
        __VLS_ctx.isOpen = false
        // @ts-ignore
        ;[userStore, isOpen]
      }
    })
  /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ const {
    default: __VLS_45
  } = __VLS_41.slots
  if (__VLS_ctx.userStore.user.photoURL) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
      src: __VLS_ctx.userStore.user.photoURL,
      ...{ class: 'w-8 h-8 rounded-full border border-white/20' }
    })
    /** @type {__VLS_StyleScopedClasses['w-8']} */
    /** @type {__VLS_StyleScopedClasses['h-8']} */
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */
    /** @type {__VLS_StyleScopedClasses['border']} */
    /** @type {__VLS_StyleScopedClasses['border-white/20']} */
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'text-sm text-gray-400' }
  })
  /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ __VLS_ctx
    .userStore.user.displayName
  // @ts-ignore
  ;[userStore, userStore, userStore]
  var __VLS_41
  var __VLS_42
  let __VLS_46
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_47 = __VLS_asFunctionalComponent1(
    __VLS_46,
    new __VLS_46({
      ...{ onClick: {} },
      to: '/create',
      ...{
        class:
          'mt-3 mb-3 w-full group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30'
      }
    })
  )
  const __VLS_48 = __VLS_47(
    {
      ...{ onClick: {} },
      to: '/create',
      ...{
        class:
          'mt-3 mb-3 w-full group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30'
      }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_47)
  )
  let __VLS_51
  const __VLS_52 =
    ({ click: {} },
    {
      onClick: (...[$event]) => {
        if (!__VLS_ctx.userStore.user) return
        __VLS_ctx.isOpen = false
        // @ts-ignore
        ;[isOpen]
      }
    })
  /** @type {__VLS_StyleScopedClasses['mt-3']} */ /** @type {__VLS_StyleScopedClasses['mb-3']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['group']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['inline-flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['px-6']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['duration-200']} */ /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ /** @type {__VLS_StyleScopedClasses['from-purple-600']} */ /** @type {__VLS_StyleScopedClasses['to-pink-600']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['hover:from-purple-500']} */ /** @type {__VLS_StyleScopedClasses['hover:to-pink-500']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-purple-500/30']} */ const {
    default: __VLS_53
  } = __VLS_49.slots
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span
  )({
    ...{ class: 'mr-2 text-xl' }
  })
  /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-xl']} */ __VLS_ctx.$t(
    'nav.createGroup'
  )
  // @ts-ignore
  ;[$t]
  var __VLS_49
  var __VLS_50
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button
  )({
    ...{ onClick: __VLS_ctx.handleLogout },
    ...{
      class:
        'text-gray-300 hover:bg-white/10 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium'
    }
  })
  /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['block']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['text-left']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ __VLS_ctx.$t(
    'nav.logout'
  )
} else {
  let __VLS_54
  /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
  routerLink
  // @ts-ignore
  const __VLS_55 = __VLS_asFunctionalComponent1(
    __VLS_54,
    new __VLS_54({
      to: '/login',
      ...{
        class:
          'w-full text-center text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
      }
    })
  )
  const __VLS_56 = __VLS_55(
    {
      to: '/login',
      ...{
        class:
          'w-full text-center text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
      }
    },
    ...__VLS_functionalComponentArgsRest(__VLS_55)
  )
  /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-300']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['block']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['rounded-md']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ const {
    default: __VLS_59
  } = __VLS_57.slots
  __VLS_ctx.$t('nav.login')
  // @ts-ignore
  ;[$t, $t, handleLogout]
  var __VLS_57
}
// @ts-ignore
;[]
const __VLS_export = (await import('vue')).defineComponent({})
export default {}
//# sourceMappingURL=Navbar.vue.js.map
