import Fuse, { IFuseOptions } from 'fuse.js'
import { computed, MaybeRef, onUnmounted, ref, unref, watch } from 'vue'

export function useFuzzySearch<T>(data: MaybeRef<T[]>, options: IFuseOptions<T> = {}) {
  const searchTerm = ref('')
  const fuse = ref<Fuse<T>>()

  // Default options for better fuzzy search results
  const defaultOptions: IFuseOptions<T> = {
    threshold: 0.4, // Match algorithm threshold (0.0 = exact match, 1.0 = match anything)
    ignoreLocation: true, // Find matches anywhere in the string
    includeScore: true,
    ...options
  }

  // Initialize Fuse instance
  const initFuse = () => {
    fuse.value = new Fuse(unref(data), defaultOptions)
  }

  // Watch for data changes to update index
  watch(
    () => unref(data),
    () => {
      initFuse()
    },
    { deep: true, immediate: true }
  )

  const results = computed(() => {
    // If no search term, return original data
    if (!searchTerm.value.trim() || !fuse.value) {
      return unref(data)
    }

    // Perform search
    const searchResults = fuse.value.search(searchTerm.value)

    // Return just the items
    return searchResults.map((result) => result.item)
  })

  // Clean up
  onUnmounted(() => {
    fuse.value = undefined
  })

  return {
    searchTerm,
    results
  }
}
