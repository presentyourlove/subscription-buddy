import { defineStore } from 'pinia'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

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
                // const querySnapshot = await getDocs(collection(db, "groups"));
                // this.groups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Fetching groups (simulated)...")
            } catch (err) {
                this.error = err.message
                console.error("Error fetching groups:", err)
            } finally {
                this.loading = false
            }
        }
    }
})
