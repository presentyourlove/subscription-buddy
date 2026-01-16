/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import chatService from '../services/chatService'
import { useChatStore } from './chatStore'

vi.mock('../services/chatService', () => ({
  default: {
    joinChat: vi.fn(),
    subscribeToMessages: vi.fn(),
    sendMessage: vi.fn(),
    confirmDeal: vi.fn(),
    rateUser: vi.fn(),
    leaveChat: vi.fn()
  }
}))

describe('ChatStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('joinChat should call service', async () => {
    const store = useChatStore()
    await store.joinChat('g1', {} as any)
    expect(chatService.joinChat).toHaveBeenCalled()
  })

  it('sendMessage should call service', async () => {
    const store = useChatStore()
    store.currentGroupId = 'g1'
    await store.sendMessage('hi', {} as any)
    expect(chatService.sendMessage).toHaveBeenCalled()
  })
})
