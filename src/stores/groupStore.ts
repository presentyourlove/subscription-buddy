import { defineStore } from 'pinia'
import { groupService } from '../services/groupService'
import { Group } from '../types'

interface GroupState {
  groups: Group[]
  loading: boolean
  error: string | null
}

export const useGroupStore = defineStore('group', {
  state: (): GroupState => ({
    groups: [],
    loading: false,
    error: null
  }),
  actions: {
    /**
     * Fetch all groups
     */
    async fetchGroups() {
      this.loading = true
      this.error = null
      try {
        this.groups = await groupService.getAllGroups()
      } catch (err: any) {
        this.error = err.message
        console.error('Error fetching groups:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add a new group
     */
    async addGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'status'>) {
      this.loading = true
      this.error = null
      try {
        await groupService.createGroup(groupData)
        // Refresh list
        await this.fetchGroups()
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete a group
     */
    async deleteGroup(groupId: string) {
      this.loading = true
      try {
        await groupService.deleteGroup(groupId)
        // Remove from local state
        this.groups = this.groups.filter((g) => g.id !== groupId)
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Update group status
     */
    async updateGroupStatus(groupId: string, status: string) {
      try {
        await groupService.updateStatus(groupId, status)
        // Update local state
        const g = this.groups.find((g) => g.id === groupId)
        if (g) (g as any).status = status // Cast to any if strict literal types clash, but simplified for now
      } catch (err) {
        console.error('Update status error:', err)
      }
    }
  }
})
