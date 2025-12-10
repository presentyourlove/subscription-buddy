import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Service to handle Group data in Firestore
 * 
 * Why: encapsulate all CRUD operations for 'groups' collection.
 * This abstraction layer handles the specific Firestore syntax, keeping the 
 * calling code (Store) clean and focused on state management.
 */
class GroupService {
    static COLLECTION = 'groups'

    /**
     * Fetch all groups
     * @returns {Promise<Array<object>>} List of groups
     */
    async getAllGroups() {
        try {
            const querySnapshot = await getDocs(collection(db, GroupService.COLLECTION))
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (err) {
            console.error('[GroupService] Fetch error:', err)
            throw err
        }
    }

    /**
     * Get single group by ID
     * @param {string} groupId
     * @returns {Promise<object|null>}
     */
    async getGroupById(groupId) {
        try {
            const docRef = doc(db, GroupService.COLLECTION, groupId)
            const docSnap = await getDoc(docRef)
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
        } catch (err) {
            console.error('[GroupService] Get error:', err)
            throw err
        }
    }

    /**
     * Add a new group
     * @param {object} groupData 
     * @returns {Promise<string>} Created Group ID
     */
    async createGroup(groupData) {
        try {
            const docRef = await addDoc(collection(db, GroupService.COLLECTION), {
                ...groupData,
                createdAt: new Date(),
                status: 'OPEN' // Default status
            })
            return docRef.id
        } catch (err) {
            console.error('[GroupService] Create error:', err)
            throw err
        }
    }

    /**
     * Delete a group
     * @param {string} groupId 
     * @returns {Promise<void>}
     */
    async deleteGroup(groupId) {
        try {
            await deleteDoc(doc(db, GroupService.COLLECTION, groupId))
        } catch (err) {
            console.error('[GroupService] Delete error:', err)
            throw err
        }
    }

    /**
     * Update group status
     * @param {string} groupId 
     * @param {string} status 
     * @returns {Promise<void>}
     */
    async updateStatus(groupId, status) {
        try {
            const groupRef = doc(db, GroupService.COLLECTION, groupId)
            await updateDoc(groupRef, { status })
        } catch (err) {
            console.error('[GroupService] Update status error:', err)
            throw err
        }
    }
}

export const groupService = new GroupService()
