import { deleteUser, User } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

import { getFirestore } from 'firebase/firestore'


export const privacyService = {
  get db() {
    return getFirestore()
  },

  /**
   * Export all user data as a JSON Blob
   */
  async exportUserData(user: User): Promise<Blob> {
    try {
      // 1. Fetch User Profile
      const userRef = doc(this.db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      const userData = userSnap.exists() ? userSnap.data() : {}

      // 2. Fetch Hosted Groups
      const qHosted = query(collection(this.db, 'groups'), where('hostId', '==', user.uid))
      const hostedSnap = await getDocs(qHosted)
      const hostedGroups = hostedSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

      // 3. Package Data
      const exportData = {
        meta: {
          exportedAt: new Date().toISOString(),
          uid: user.uid,
          email: user.email
        },
        profile: userData,
        hostedGroups: hostedGroups
      }

      // 4. Create Blob
      const jsonString = JSON.stringify(exportData, null, 2)
      return new Blob([jsonString], { type: 'application/json' })
    } catch (err) {
      console.error('Export user data failed:', err)
      throw err
    }
  },

  /**
   * Delete user account and basic firestore data
   * Note: This requires recent login. If it fails with 'requires-recent-login',
   * the UI should prompt user to re-authenticate.
   */
  async deleteUserAccount(user: User): Promise<void> {
    try {
      // 1. Delete Firestore User Document
      // Note: Real-world apps might need to handle orphaned groups or use Cloud Functions to recursively delete data.
      // Here we only delete the direct user profile as a V1 GDPR implementation.
      // 1. Delete Firestore User Document
      // Note: Real-world apps might need to handle orphaned groups or use Cloud Functions to recursively delete data.
      // Here we only delete the direct user profile as a V1 GDPR implementation.
      const userRef = doc(this.db, 'users', user.uid)
      await deleteDoc(userRef)

      // 2. Delete Auth Account
      await deleteUser(user)
    } catch (err) {
      console.error('Delete user account failed:', err)
      throw err // Re-throw to handle in UI (e.g. show re-login prompt)
    }
  }
}
