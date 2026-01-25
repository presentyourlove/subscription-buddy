import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  getFirestore
} from 'firebase/firestore'

// import { db } from '../firebase/config'
import { Group } from '../types'
import { COLLECTIONS, GROUP_STATUS } from '../utils/constants'

/**
 * Service to handle Group data in Firestore
 */
class GroupService {
  get db() {
    return getFirestore()
  }

  static COLLECTION = COLLECTIONS.GROUPS

  /**
   * Fetch groups with pagination
   */
  async getGroups(
    limitCount: number = 10,
    lastDoc?: DocumentSnapshot
  ): Promise<{ groups: Group[]; lastDoc: DocumentSnapshot | null }> {
    try {
      let q = query(
        collection(this.db, GroupService.COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      if (lastDoc) {
        q = query(
          collection(this.db, GroupService.COLLECTION),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        )
      }

      const querySnapshot = await getDocs(q)
      const groups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Group)
      const newLastDoc =
        querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null

      return { groups, lastDoc: newLastDoc }
    } catch (err) {
      console.error('[GroupService] Fetch error:', err)
      throw err
    }
  }

  /**
   * Get single group by ID
   */
  async getGroupById(groupId: string): Promise<Group | null> {
    try {
      const docRef = doc(this.db, GroupService.COLLECTION, groupId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Group) : null
    } catch (err) {
      console.error('[GroupService] Get error:', err)
      throw err
    }
  }

  /**
   * Add a new group
   */
  async createGroup(
    groupData: Omit<Group, 'id' | 'createdAt' | 'status'>,
    idempotencyKey?: string
  ): Promise<string> {
    try {
      const data = {
        ...groupData,
        createdAt: new Date(),
        status: GROUP_STATUS.OPEN
      }

      if (idempotencyKey) {
        // Idempotency: Use key as Document ID
        const docRef = doc(this.db, GroupService.COLLECTION, idempotencyKey)
        await setDoc(docRef, data)
        return idempotencyKey
      } else {
        // Fallback: Auto-generate ID (Legacy behavior)
        const docRef = await addDoc(collection(this.db, GroupService.COLLECTION), data)
        return docRef.id
      }
    } catch (err) {
      console.error('[GroupService] Create error:', err)
      throw err
    }
  }

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, GroupService.COLLECTION, groupId))
    } catch (err) {
      console.error('[GroupService] Delete error:', err)
      throw err
    }
  }

  /**
   * Update group status
   */
  async updateStatus(groupId: string, status: string): Promise<void> {
    try {
      const groupRef = doc(this.db, GroupService.COLLECTION, groupId)
      await updateDoc(groupRef, { status })
    } catch (err) {
      console.error('[GroupService] Update status error:', err)
      throw err
    }
  }
}

export const groupService = new GroupService()
