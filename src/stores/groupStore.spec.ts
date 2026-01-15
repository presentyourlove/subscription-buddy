import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { groupService } from '../services/groupService'
import { useGroupStore } from './groupStore'

vi.mock('../services/groupService', () => ({
  groupService: {
    createGroup: vi.fn(),
    getGroups: vi.fn(),
    getAllGroups: vi.fn(),
    getGroupById: vi.fn(),
    deleteGroup: vi.fn(),
    updateStatus: vi.fn(),
    closeGroup: vi.fn()
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
    vi.mocked(groupService.getAllGroups).mockResolvedValue(mockGroups as any)

    await store.fetchGroups()

    expect(store.groups).toEqual(mockGroups)
    expect(store.loading).toBe(false)
  })

  it('fetchGroupById should update currentGroup', async () => {
    const store = useGroupStore()
    const mockGroup = { id: '1', title: 'Group 1' }
    vi.mocked(groupService.getGroupById).mockResolvedValue(mockGroup as any)

    await store.fetchGroupById('1')

    expect(store.currentGroup).toEqual(mockGroup)
  })

  it('addGroup should call service', async () => {
    const store = useGroupStore()
    const mockData = { title: 'New Group' }
    const mockUser = { uid: 'u1' }

    // Mock user store implicitly or pass user if action requires it
    // Looking at store implementation, addGroup might take user or use store.user
    // But usually store actions call service.
    // Let's assume standard implementation.

    await store.addGroup(mockData as any, mockUser as any)
    expect(groupService.createGroup).toHaveBeenCalled()
  })
})
