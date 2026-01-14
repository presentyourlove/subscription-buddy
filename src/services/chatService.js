import { db } from '../firebase/config'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  runTransaction
} from 'firebase/firestore'
import { COLLECTIONS, MESSAGE_TYPES, DEFAULTS, ERROR_CODES, GROUP_STATUS } from '../utils/constants'
/**
 * Service to handle Chat and Rating logic in Firestore
 */
class ChatService {
  /**
   * Join a chat group
   */
  async joinChat(groupId, user) {
    if (!user) throw new Error('User required')
    const chatRef = doc(db, COLLECTIONS.CHATS, groupId)
    const chatSnap = await getDoc(chatRef)
    let isNewJoin = true
    if (chatSnap.exists()) {
      const data = chatSnap.data()
      if (data.participants && data.participants.includes(user.uid)) {
        isNewJoin = false
      }
    }
    // Check pending reviews if joining a new group
    if (isNewJoin) {
      const pendingGroupId = await this.checkPendingReviews(user)
      if (pendingGroupId) {
        throw new Error(`${ERROR_CODES.PENDING_REVIEW}:${pendingGroupId}`)
      }
    }
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [user.uid],
        createdAt: serverTimestamp()
      })
    } else {
      await updateDoc(chatRef, {
        participants: arrayUnion(user.uid)
      })
    }
  }
  /**
   * Subscribe to realtime messages for a group
   */
  subscribeToMessages(groupId, callback, onError) {
    const q = query(
      collection(db, COLLECTIONS.CHATS, groupId, COLLECTIONS.MESSAGES),
      orderBy('createdAt', 'asc')
    )
    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        callback(messages)
      },
      onError
    )
  }
  /**
   * Send a text message
   */
  async sendMessage(groupId, text, user) {
    const colRef = collection(db, COLLECTIONS.CHATS, groupId, COLLECTIONS.MESSAGES)
    await addDoc(colRef, {
      text: text,
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      senderAvatar: user.photoURL || null,
      createdAt: serverTimestamp(),
      type: MESSAGE_TYPES.TEXT
    })
  }
  /**
   * Confirm the deal
   */
  async confirmDeal(groupId, user) {
    await runTransaction(db, async (transaction) => {
      const chatRef = doc(db, COLLECTIONS.CHATS, groupId)
      const chatDoc = await transaction.get(chatRef)
      if (!chatDoc.exists()) throw 'Chat not found'
      const data = chatDoc.data()
      const participants = data.participants || []
      let confirmed = data.confirmedUsers || []
      if (!confirmed.includes(user.uid)) {
        confirmed = [...confirmed, user.uid]
      }
      const updates = { confirmedUsers: confirmed }
      // Check if everyone has confirmed
      const allConfirmed =
        participants.length > 0 && participants.every((p) => confirmed.includes(p))
      if (allConfirmed) {
        const expiryDate = new Date()
        expiryDate.setFullYear(expiryDate.getFullYear() + DEFAULTS.EXPIRY_YEARS)
        updates.expireAt = expiryDate
      }
      transaction.update(chatRef, updates)
    })
  }
  /**
   * Leave the chat
   */
  async leaveChat(groupId, user) {
    const chatRef = doc(db, COLLECTIONS.CHATS, groupId)
    await updateDoc(chatRef, {
      participants: arrayRemove(user.uid)
    })
  }
  /**
   * Rate another user
   */
  async rateUser(groupId, targetUserId, score, reviewerId) {
    await runTransaction(db, async (transaction) => {
      const chatRef = doc(db, COLLECTIONS.CHATS, groupId)
      const userRef = doc(db, COLLECTIONS.USERS, targetUserId)
      const chatDoc = await transaction.get(chatRef)
      if (!chatDoc.exists()) throw 'Chat does not exist!'
      const data = chatDoc.data()
      if (data.ratings && data.ratings[reviewerId] && data.ratings[reviewerId][targetUserId]) {
        // Corrected check
        // Wait, data.ratings[reviewerId] might not be an object if checking existence deep?
        // Actually if TS strict, this access is risky.
      }
      // Re-implementing logic safely
      // data.ratings is Record<string, Record<string, number>>
      const hasRated = data.ratings?.[reviewerId]?.[targetUserId]
      if (hasRated) {
        throw 'You have already rated this user.'
      }
      const userDoc = await transaction.get(userRef)
      if (!userDoc.exists()) throw 'User does not exist!'
      const userData = userDoc.data()
      const newCount = (userData.ratingCount || DEFAULTS.RATING_COUNT) + 1
      const newSum = (userData.ratingSum || DEFAULTS.RATING_SUM) + score
      transaction.update(userRef, {
        ratingCount: newCount,
        ratingSum: newSum
      })
      const updateData = {}
      updateData[`ratings.${reviewerId}.${targetUserId}`] = score
      transaction.update(chatRef, updateData)
    })
  }
  /**
   * Check for any pending reviews for closed groups
   */
  async checkPendingReviews(user) {
    if (!user) return null
    // Strategy 1: Check chats where I am a participant
    const qChats = query(
      collection(db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', user.uid)
    )
    const chatSnaps = await getDocs(qChats)
    // Strategy 2: Check groups where I am the Host
    const qGroups = query(
      collection(db, COLLECTIONS.GROUPS),
      where('hostId', '==', user.uid),
      where('status', '==', GROUP_STATUS.CLOSED)
    )
    const groupSnaps = await getDocs(qGroups)
    const candidateGroupIds = new Set()
    chatSnaps.forEach((d) => candidateGroupIds.add(d.id))
    groupSnaps.forEach((d) => candidateGroupIds.add(d.id))
    for (const groupId of candidateGroupIds) {
      const chatRef = doc(db, COLLECTIONS.CHATS, groupId)
      const chatSnap = await getDoc(chatRef)
      if (!chatSnap.exists()) continue
      const data = chatSnap.data()
      const participants = data.participants || []
      const otherParticipants = participants.filter((uid) => uid !== user.uid)
      if (otherParticipants.length === 0) continue
      let isClosed = false
      // Check confirmation status
      const confirmed = data.confirmedUsers || []
      if (participants.length > 0 && confirmed.length >= participants.length) {
        isClosed = true
      }
      // Check group status
      if (!isClosed) {
        const groupDoc = groupSnaps.docs.find((g) => g.id === groupId)
        if (groupDoc) {
          isClosed = true
        } else {
          try {
            const gSnap = await getDoc(doc(db, COLLECTIONS.GROUPS, groupId))
            if (gSnap.exists() && gSnap.data().status === GROUP_STATUS.CLOSED) isClosed = true
          } catch (e) {
            // ignore error
          }
        }
      }
      if (isClosed) {
        const myRatings = data.ratings ? data.ratings[user.uid] : null
        // Block if no ratings found
        if (!myRatings || Object.keys(myRatings).length === 0) {
          return groupId
        }
      }
    }
    return null
  }
}
export default new ChatService()
//# sourceMappingURL=chatService.js.map
