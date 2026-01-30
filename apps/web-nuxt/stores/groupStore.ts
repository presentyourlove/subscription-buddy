import { defineStore } from 'pinia'
import { ref } from 'vue'

import { EVENTS, useAnalytics } from '../composables/useAnalytics'
import { groupService } from '@subscription-buddy/core'
import { Group } from '@subscription-buddy/core'

const { logEvent } = useAnalytics()

export const useGroupStore = defineStore(
  'group',
  () => {
    // State
    const groups = ref<Group[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastDoc = ref<any>(null)
    const hasMore = ref(true)
    const searchQuery = ref('')

    // Actions
    const fetchGroups = async () => {
      loading.value = true
      error.value = null
      lastDoc.value = null
      hasMore.value = true
      try {
        const res = await groupService.getGroups(10)
        groups.value = res.groups
        lastDoc.value = res.lastDoc
        hasMore.value = res.groups.length === 10
        logEvent(EVENTS.VIEW_GROUP_LIST)
      } catch (err) {
        if (err instanceof Error) {
          error.value = err.message
        }
        console.error('Error fetching groups:', err)
      } finally {
        loading.value = false
      }
    }

    const fetchNextPage = async () => {
      if (!hasMore.value || loading.value) return

      loading.value = true
      try {
        const res = await groupService.getGroups(10, lastDoc.value)
        groups.value = [...groups.value, ...res.groups]
        lastDoc.value = res.lastDoc
        hasMore.value = res.groups.length === 10
      } catch (err) {
        if (err instanceof Error) {
          error.value = err.message
        }
        console.error('Error fetching next page:', err)
      } finally {
        loading.value = false
      }
    }

    const addGroup = async (groupData: Omit<Group, 'id' | 'createdAt' | 'status'>) => {
      loading.value = true
      error.value = null
      try {
        const idempotencyKey = crypto.randomUUID()
        await groupService.createGroup(groupData, idempotencyKey)
        await fetchGroups()
        logEvent(EVENTS.CREATE_GROUP, { title: groupData.title, category: groupData.serviceName })
      } catch (err) {
        if (err instanceof Error) {
          error.value = err.message
        }
        throw err
      } finally {
        loading.value = false
      }
    }

    const deleteGroup = async (groupId: string) => {
      loading.value = true
      try {
        await groupService.deleteGroup(groupId)
        groups.value = groups.value.filter((g) => g.id !== groupId)
      } catch (err) {
        if (err instanceof Error) {
          error.value = err.message
        }
        throw err
      } finally {
        loading.value = false
      }
    }

    const updateGroupStatus = async (groupId: string, status: string) => {
      try {
        await groupService.updateStatus(groupId, status)
        const g = groups.value.find((g) => g.id === groupId)
        if (g) {
          g.status = status as Group['status']
        }
      } catch (err) {
        console.error('Update status error:', err)
      }
    }

    return {
      groups,
      loading,
      error,
      lastDoc,
      hasMore,
      searchQuery,
      fetchGroups,
      fetchNextPage,
      addGroup,
      deleteGroup,
      updateGroupStatus
    }
  },
  {
    persist: {
      paths: ['groups', 'searchQuery']
    }
  } as any // Cast to any to avoid type inference issues with persist plugin
)
