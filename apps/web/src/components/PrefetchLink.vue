<template>
  <router-link v-bind="$attrs" :to="to" @mouseenter="prefetch">
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { RouteLocationRaw, useRouter } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    required: true
  }
})

const router = useRouter()

const prefetch = () => {
  try {
    const route = router.resolve(props.to)
    const components = route.matched.flatMap((record) => Object.values(record.components || {}))

    for (const component of components) {
      if (typeof component === 'function') {
        // Execute the dynamic import function to trigger download
        ;(component as any)()
      }
    }
  } catch (err) {
    // Ignore prefetch errors (e.g. invalid routes)
    console.warn('Prefetch failed:', err)
  }
}
</script>
