import * as firestore from 'firebase/firestore'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useFirestoreDoc } from './useFirestoreDoc'

vi.mock('firebase/firestore', () => ({
  onSnapshot: vi.fn(),
  doc: vi.fn()
}))

vi.mock('../firebase/config', () => ({
  db: {}
}))

describe('useFirestoreDoc', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not subscribe if docId is null', () => {
    const docId = ref<string | null>(null)
    useFirestoreDoc('collection', docId)
    expect(firestore.onSnapshot).not.toHaveBeenCalled()
  })

  it('should subscribe when docId is provided', () => {
    const docId = ref('123')
    useFirestoreDoc('collection', docId)
    expect(firestore.onSnapshot).toHaveBeenCalled()
  })
})
