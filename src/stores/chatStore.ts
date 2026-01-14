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
      } catch (err: any) {
        console.error('Join chat error:', err)
        if (err.message && err.message.startsWith(`${ERROR_CODES.PENDING_REVIEW}:`)) {
          const pendingGroupId = err.message.split(':')[1]
          this.error = `您有尚未完成的評價 (Group ID: ${pendingGroupId})，請先完成評價！`
        } else {
          this.error = err.message || 'Unknown error'
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
          this.error = err.message
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
      } catch (err: any) {
        console.error('Send message error:', err)
        this.error = err.message
        throw err
      }
    },

    async confirmDeal(groupId: string, user: User) {
      this.error = null
      try {
        await chatService.confirmDeal(groupId, user)
      } catch (err: any) {
        console.error('Confirm deal error:', err)
        this.error = err.message
        throw err
      }
    },

    async leaveChat(groupId: string, user: User) {
      this.error = null
      try {
        await chatService.leaveChat(groupId, user)
      } catch (err: any) {
        console.error('Leave chat error:', err)
        this.error = err.message
        throw err
      }
    },

    async rateUser(groupId: string, targetUserId: string, score: number, reviewerId: string) {
      this.error = null
      try {
        await chatService.rateUser(groupId, targetUserId, score, reviewerId)
      } catch (err: any) {
        console.error('Rate user error:', err)
        this.error = typeof err === 'string' ? err : err.message || 'Error rating user'
        throw err
      }
    },

    async checkPendingReviews(user: User) {
      return await chatService.checkPendingReviews(user)
    }
  }
})
