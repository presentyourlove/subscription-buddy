import { defineStore } from 'pinia'
import { groupService } from '../services/groupService'
import { Group } from '../types'

interface GroupState {
  groups: Group[]
  loading: boolean
  error: string | null
  lastDoc: any // Using specific type might require importing DocumentSnapshot which is heavy for store type, or use 'unknown'
  hasMore: boolean
}

export const useGroupStore = defineStore('group', {
  state: (): GroupState => ({
    groups: [],
    loading: false,
    error: null,
    lastDoc: null,
    hasMore: true
  }),
  actions: {
    /**
     * Fetch initial groups (reset pagination)
     */
    async fetchGroups() {
      this.loading = true
      this.error = null
      this.groups = [] // Reset
      this.lastDoc = null
      this.hasMore = true
      try {
        const { groups, lastDoc } = await groupService.getGroups(10) // Limit 10
        this.groups = groups
        this.lastDoc = lastDoc
        this.hasMore = groups.length === 10
      } catch (err) {
        if (err instanceof Error) {
          this.error = err.message
        }
        console.error('Error fetching groups:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchNextPage() {
      if (!this.hasMore || this.loading) return

      this.loading = true
      try {
        const { groups, lastDoc } = await groupService.getGroups(10, this.lastDoc)
        this.groups = [...this.groups, ...groups]
        this.lastDoc = lastDoc
        this.hasMore = groups.length === 10
      } catch (err) {
        if (err instanceof Error) {
          this.error = err.message
        }
        console.error('Error fetching next page:', err)
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
      } catch (err) {
        if (err instanceof Error) {
          this.error = err.message
        }
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
      } catch (err) {
        if (err instanceof Error) {
          this.error = err.message
        }
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
        if (g) {
          // @ts-ignore: Assuming status is valid for now, or we'd need to update Group type
          g.status = status
        }
      } catch (err) {
        console.error('Update status error:', err)
      }
    }
  }
})
