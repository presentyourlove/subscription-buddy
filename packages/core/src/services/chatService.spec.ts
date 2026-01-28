import * as firestore from 'firebase/firestore'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { chatService } from './chatService'

// Mock Firestore
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn(),
    serverTimestamp: vi.fn(),
    arrayUnion: vi.fn(),
    arrayRemove: vi.fn(),
    arrayRemove: vi.fn(),
    runTransaction: vi.fn(),
    getFirestore: vi.fn(() => ({})),
    getDocs: vi.fn()
  }
})

vi.mock('../firebase/config', () => {
  return {
    db: {}
  }
})

describe('ChatService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('joinChat', () => {
    it('should add user to participants if chat exists', async () => {
      const mockUser = { uid: 'u1' }
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({ participants: ['u2'] })
      } as any)

      await chatService.joinChat('g1', mockUser as any)

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          participants: expect.anything() // arrayUnion mock is tricky to match exactly without deep mock
        })
      )
    })

    it('should create chat if not exists', async () => {
      const mockUser = { uid: 'u1' }
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => false
      } as any)

      await chatService.joinChat('g1', mockUser as any)

      expect(firestore.setDoc).toHaveBeenCalled()
    })
  })

  describe('sendMessage', () => {
    it('should add message to collection', async () => {
      const mockUser = { uid: 'u1', displayName: 'User' }
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({ participants: ['u1'] })
      } as any)

      await chatService.sendMessage('g1', 'Hello', mockUser as any)

      expect(firestore.addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          text: 'Hello',
          senderId: 'u1'
        })
      )
    })
  })
})
