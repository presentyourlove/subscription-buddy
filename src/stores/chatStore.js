import { defineStore } from 'pinia'
import chatService from '../services/chatService'

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [],
        unsubscribe: null,
        loading: false,
        error: null,
        currentGroupId: null
    }),
    actions: {
        async joinChat(groupId, user) {
            if (!user) return

            this.loading = true
            this.error = null
            try {
                await chatService.joinChat(groupId, user)
            } catch (err) {
                console.error("Join chat error:", err)
                if (err.message.startsWith('PENDING_REVIEW:')) {
                    const pendingGroupId = err.message.split(':')[1]
                    this.error = `您有尚未完成的評價 (Group ID: ${pendingGroupId})，請先完成評價！`
                } else {
                    this.error = err.message
                }
                throw err
            } finally {
                this.loading = false
            }
        },

        subscribeToMessages(groupId) {
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
                    console.error("Snapshot error:", err)
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

        async sendMessage(text, user) {
            if (!this.currentGroupId || !user || !text.trim()) return
            this.error = null
            try {
                await chatService.sendMessage(this.currentGroupId, text, user)
            } catch (err) {
                console.error("Send message error:", err)
                this.error = err.message
                throw err
            }
        },

        async confirmDeal(groupId, user) {
            this.error = null
            try {
                await chatService.confirmDeal(groupId, user)
            } catch (err) {
                console.error("Confirm deal error:", err)
                this.error = err.message
                throw err
            }
        },

        async leaveChat(groupId, user) {
            this.error = null
            try {
                await chatService.leaveChat(groupId, user)
            } catch (err) {
                console.error("Leave chat error:", err)
                this.error = err.message
                throw err
            }
        },

        async rateUser(groupId, targetUserId, score, reviewerId) {
            this.error = null
            try {
                await chatService.rateUser(groupId, targetUserId, score, reviewerId)
            } catch (err) {
                console.error("Rate user error:", err)
                this.error = typeof err === 'string' ? err : err.message
                throw err
            }
        },

        async checkPendingReviews(user) {
            return await chatService.checkPendingReviews(user)
        }
    }
})
