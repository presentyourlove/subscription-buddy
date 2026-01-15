import { defineStore } from 'pinia'
import chatService from '../services/chatService'
import { ERROR_CODES } from '../utils/constants'
import { Message } from '../types'
import { User } from 'firebase/auth'

interface ChatState {
  messages: Message[]
  unsubscribe: (() => void) | null
  loading: boolean
  error: string | null
  currentGroupId: string | null
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    unsubscribe: null,
    loading: false,
    error: null,
    currentGroupId: null
  }),
  actions: {
    async joinChat(groupId: string, user: User) {
      if (!user) return

      this.loading = true
      this.error = null
      try {
        await chatService.joinChat(groupId, user)
      } catch (err) {
        console.error('Join chat error:', err)
        let errorMessage = 'Unknown error'
        if (err instanceof Error) {
          errorMessage = err.message
        }

        if (errorMessage.startsWith(`${ERROR_CODES.PENDING_REVIEW}:`)) {
          const pendingGroupId = errorMessage.split(':')[1]
          this.error = `您有尚未完成的評價 (Group ID: ${pendingGroupId})，請先完成評價！`
        } else {
          this.error = errorMessage
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    subscribeToMessages(groupId: string) {
      // Unsubscribe previous listener if exists
      this.unsubscribeFromMessages()

      this.currentGroupId = groupId
      this.error = null

      this.unsubscribe = chatService.subscribeToMessages(
        groupId,
        (messages) => {
          this.messages = messages
        },
        (err) => {
          console.error('Snapshot error:', err)
          this.error = err instanceof Error ? err.message : 'Unknown snapshot error'
        }
      )
    },

    unsubscribeFromMessages() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
      this.messages = []
      this.currentGroupId = null
    },

    async sendMessage(text: string, user: User) {
      if (!this.currentGroupId || !user || !text.trim()) return
      this.error = null
      try {
        await chatService.sendMessage(this.currentGroupId, text, user)
      } catch (err) {
        console.error('Send message error:', err)
        this.error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      }
    },

    async confirmDeal(groupId: string, user: User) {
      this.error = null
      try {
        await chatService.confirmDeal(groupId, user)
      } catch (err) {
        console.error('Confirm deal error:', err)
        this.error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      }
    },

    async leaveChat(groupId: string, user: User) {
      this.error = null
      try {
        await chatService.leaveChat(groupId, user)
      } catch (err) {
        console.error('Leave chat error:', err)
        this.error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      }
    },

    async rateUser(groupId: string, targetUserId: string, score: number, reviewerId: string) {
      this.error = null
      try {
        await chatService.rateUser(groupId, targetUserId, score, reviewerId)
      } catch (err) {
        console.error('Rate user error:', err)
        if (typeof err === 'string') {
          this.error = err
        } else if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Error rating user'
        }
        throw err
      }
    },

    async checkPendingReviews(user: User) {
      return await chatService.checkPendingReviews(user)
    }
  }
})
