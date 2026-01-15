import { doc, DocumentData, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { isRef, onUnmounted, Ref, ref, watch } from 'vue'

import { db } from '../firebase/config'

/**
 * Composable for real-time Firestore document listening
 * @param collectionName - Firestore collection name
 * @param docId - Document ID (can be reactive ref or string)
 * @returns Reactive data, loading state, and error
 */
export function useFirestoreDoc<T = DocumentData>(
  collectionName: string,
  docId: Ref<string> | string
) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(true)
  const error = ref<Error | null>(null)

  let unsubscribe: Unsubscribe | null = null

  const subscribe = (id: string) => {
    // Cleanup previous subscription
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    if (!id) {
      data.value = null
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    unsubscribe = onSnapshot(
      doc(db, collectionName, id),
      (snapshot) => {
        if (snapshot.exists()) {
          data.value = { id: snapshot.id, ...snapshot.data() } as T
        } else {
          data.value = null
        }
        loading.value = false
      },
      (err) => {
        error.value = err
        loading.value = false
      }
    )
  }

  // Initialize subscription
  const initialId = isRef(docId) ? docId.value : docId
  subscribe(initialId)

  // Watch for docId changes if reactive
  if (isRef(docId)) {
    watch(docId, (newId) => {
      subscribe(newId)
    })
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  return {
    data,
    loading,
    error
  }
}
