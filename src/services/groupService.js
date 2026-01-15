import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS, GROUP_STATUS } from '../utils/constants';
/**
 * Service to handle Group data in Firestore
 */
class GroupService {
    static COLLECTION = COLLECTIONS.GROUPS;
    /**
     * Fetch groups with pagination
     */
    async getGroups(limitCount = 10, lastDoc) {
        try {
            let q = query(collection(db, GroupService.COLLECTION), orderBy('createdAt', 'desc'), limit(limitCount));
            if (lastDoc) {
                q = query(collection(db, GroupService.COLLECTION), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(limitCount));
            }
            const querySnapshot = await getDocs(q);
            const groups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const newLastDoc = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
            return { groups, lastDoc: newLastDoc };
        }
        catch (err) {
            console.error('[GroupService] Fetch error:', err);
            throw err;
        }
    }
    /**
     * Get single group by ID
     */
    async getGroupById(groupId) {
        try {
            const docRef = doc(db, GroupService.COLLECTION, groupId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        }
        catch (err) {
            console.error('[GroupService] Get error:', err);
            throw err;
        }
    }
    /**
     * Add a new group
     */
    async createGroup(groupData) {
        try {
            const docRef = await addDoc(collection(db, GroupService.COLLECTION), {
                ...groupData,
                createdAt: new Date(),
                status: GROUP_STATUS.OPEN
            });
            return docRef.id;
        }
        catch (err) {
            console.error('[GroupService] Create error:', err);
            throw err;
        }
    }
    /**
     * Delete a group
     */
    async deleteGroup(groupId) {
        try {
            await deleteDoc(doc(db, GroupService.COLLECTION, groupId));
        }
        catch (err) {
            console.error('[GroupService] Delete error:', err);
            throw err;
        }
    }
    /**
     * Update group status
     */
    async updateStatus(groupId, status) {
        try {
            const groupRef = doc(db, GroupService.COLLECTION, groupId);
            await updateDoc(groupRef, { status });
        }
        catch (err) {
            console.error('[GroupService] Update status error:', err);
            throw err;
        }
    }
}
export const groupService = new GroupService();
//# sourceMappingURL=groupService.js.map