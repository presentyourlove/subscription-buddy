/* eslint-disable @typescript-eslint/no-explicit-any */
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import UserRating from './UserRating.vue'

// Mock Firebase
const mockGetDoc = vi.fn()
const mockDoc = vi.fn()

vi.mock('firebase/firestore', () => ({
  getDoc: (ref: any) => mockGetDoc(ref),
  doc: (db: any, col: string, id: string) => mockDoc(db, col, id)
}))

vi.mock('../firebase/config', () => ({
  db: {}
}))

describe('UserRating', () => {
  it('renders loading initially', () => {
    const wrapper = mount(UserRating, {
      props: { uid: '123' }
    })
    expect(wrapper.text()).toContain('...')
  })

  it('renders score when data fetched successfully', async () => {
    // Setup mock
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ ratingSum: 10, ratingCount: 2 })
    })

    const wrapper = mount(UserRating, {
      props: { uid: '123' }
    })

    // Wait for async operations
    await flushPromises()

    // 10 / 2 = 5.0
    expect(wrapper.text()).toContain('5.0')
    expect(wrapper.text()).toContain('(2)')
  })

  it('renders no rating when count is 0', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ ratingSum: 0, ratingCount: 0 })
    })

    const wrapper = mount(UserRating, {
      props: { uid: '123' }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('(無評價)')
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetDoc.mockRejectedValue(new Error('Fetch failed'))

    const wrapper = mount(UserRating, {
      props: { uid: '123' }
    })

    await flushPromises()

    // Should stop loading (but might show empty/default state)
    // The component sets loading = false in finally block
    // If error, ratingCount is 0 (default), so renders "(無評價)"
    expect(wrapper.text()).toContain('(無評價)')

    consoleSpy.mockRestore()
  })
})
