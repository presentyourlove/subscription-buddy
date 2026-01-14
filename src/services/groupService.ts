import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { COLLECTIONS, GROUP_STATUS } from '../utils/constants'
import { Group } from '../types'

/**
 * Service to handle Group data in Firestore
 */
class GroupService {
  static COLLECTION = COLLECTIONS.GROUPS

  /**
   * Fetch all groups
   */
  async getAllGroups(): Promise<Group[]> {
    try {
      const querySnapshot = await getDocs(collection(db, GroupService.COLLECTION))
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Group)
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
      const docRef = doc(db, GroupService.COLLECTION, groupId)
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
  async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, GroupService.COLLECTION), {
        ...groupData,
        createdAt: new Date(),
        status: GROUP_STATUS.OPEN
      })
      return docRef.id
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
      await deleteDoc(doc(db, GroupService.COLLECTION, groupId))
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
      const groupRef = doc(db, GroupService.COLLECTION, groupId)
      await updateDoc(groupRef, { status })
    } catch (err) {
      console.error('[GroupService] Update status error:', err)
      throw err
    }
  }
}

export const groupService = new GroupService()
