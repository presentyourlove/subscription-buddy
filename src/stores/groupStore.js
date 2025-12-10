import { defineStore } from 'pinia'
import { db } from '../firebase/config'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const useGroupStore = defineStore('group', {
    state: () => ({
        groups: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchGroups() {
            this.loading = true
            try {
                const querySnapshot = await getDocs(collection(db, "groups"));
                this.groups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (err) {
                this.error = err.message
                console.error("Error fetching groups:", err)
            } finally {
                this.loading = false
            }
        },
        async addGroup(groupData) {
            this.loading = true;
            try {
                const docRef = await addDoc(collection(db, "groups"), {
                    ...groupData,
                    createdAt: new Date(),
                    status: 'OPEN'
                });
                console.log("Document written with ID: ", docRef.id);
                // Refresh list
                await this.fetchGroups();
            } catch (err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async deleteGroup(groupId) {
            this.loading = true
            try {
                await deleteDoc(doc(db, "groups", groupId));
                // Remove from local state
                this.groups = this.groups.filter(g => g.id !== groupId)
            } catch (err) {
                this.error = err.message
                throw err
            } finally {
                this.loading = false
            }
        },
        async updateGroupStatus(groupId, status) {
            try {
                const groupRef = doc(db, 'groups', groupId)
                await updateDoc(groupRef, { status })
                // Update local state
                const g = this.groups.find(g => g.id === groupId)
                if (g) g.status = status
            } catch (err) {
                console.error("Update status error:", err)
                // Don't throw, just log. It might fail if not host.
            }
        }
    }
})
