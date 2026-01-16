/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { groupService } from '../services/groupService'
import { useGroupStore } from './groupStore'

vi.mock('../services/groupService', () => ({
  groupService: {
    createGroup: vi.fn(),
    getGroups: vi.fn(),
    deleteGroup: vi.fn(),
    updateStatus: vi.fn()
  }
}))

describe('GroupStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetchGroups should update groups state', async () => {
    const store = useGroupStore()
    const mockGroups = [{ id: '1', title: 'Group 1' }]
    vi.mocked(groupService.getGroups).mockResolvedValue({
      groups: mockGroups,
      lastDoc: null
    } as any)

    await store.fetchGroups()

    expect(store.groups).toEqual(mockGroups)
    expect(store.loading).toBe(false)
  })

  // Removed fetchGroupById test as it does not exist in store

  it('addGroup should call service', async () => {
    const store = useGroupStore()
    const mockData = { title: 'New Group' }

    await store.addGroup(mockData as any)
    expect(groupService.createGroup).toHaveBeenCalled()
  })
})
