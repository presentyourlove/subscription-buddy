import { defineStore } from 'pinia';
import { groupService } from '../services/groupService';
export const useGroupStore = defineStore('group', {
    state: () => ({
        groups: [],
        loading: false,
        error: null
    }),
    actions: {
        /**
         * Fetch all groups
         */
        async fetchGroups() {
            this.loading = true;
            this.error = null;
            try {
                this.groups = await groupService.getAllGroups();
            }
            catch (err) {
                this.error = err.message;
                console.error('Error fetching groups:', err);
            }
            finally {
                this.loading = false;
            }
        },
        /**
         * Add a new group
         */
        async addGroup(groupData) {
            this.loading = true;
            this.error = null;
            try {
                await groupService.createGroup(groupData);
                // Refresh list
                await this.fetchGroups();
            }
            catch (err) {
                this.error = err.message;
                throw err;
            }
            finally {
                this.loading = false;
            }
        },
        /**
         * Delete a group
         */
        async deleteGroup(groupId) {
            this.loading = true;
            try {
                await groupService.deleteGroup(groupId);
                // Remove from local state
                this.groups = this.groups.filter((g) => g.id !== groupId);
            }
            catch (err) {
                this.error = err.message;
                throw err;
            }
            finally {
                this.loading = false;
            }
        },
        /**
         * Update group status
         */
        async updateGroupStatus(groupId, status) {
            try {
                await groupService.updateStatus(groupId, status);
                // Update local state
                const g = this.groups.find((g) => g.id === groupId);
                if (g)
                    g.status = status; // Cast to any if strict literal types clash, but simplified for now
            }
            catch (err) {
                console.error('Update status error:', err);
            }
        }
    }
});
//# sourceMappingURL=groupStore.js.map