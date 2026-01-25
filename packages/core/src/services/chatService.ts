import { User } from 'firebase/auth'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  getFirestore
} from 'firebase/firestore'

// import { db } from '../firebase/config'
import { Chat, Group, Message, UserProfile } from '../types'
import { COLLECTIONS, DEFAULTS, ERROR_CODES, GROUP_STATUS, MESSAGE_TYPES } from '../utils/constants'
import { cryptoService } from './CryptoService'
import { userService } from './userService'

/**
 * Service to handle Chat and Rating logic in Firestore
 */
class ChatService {
  get db() {
    return getFirestore()
  }

  /**
   * Join a chat group
   */
  async joinChat(groupId: string, user: User): Promise<void> {
    if (!user) throw new Error('User required')

    const chatRef = doc(this.db, COLLECTIONS.CHATS, groupId)
    const chatSnap = await getDoc(chatRef)

    let isNewJoin = true
    if (chatSnap.exists()) {
      const data = chatSnap.data() as Chat
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
  subscribeToMessages(
    groupId: string,
    callback: (messages: Message[]) => void,
    onError: (error: unknown) => void
  ) {
    const q = query(
      collection(this.db, COLLECTIONS.CHATS, groupId, COLLECTIONS.MESSAGES),
      orderBy('createdAt', 'asc')
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data()
            }) as Message
        )
        callback(messages)
      },
      onError
    )
  }

  /**
   * Send a text message
   */
  /**
   * Send a text message (Encrypted)
   */
  async sendMessage(groupId: string, text: string, user: User): Promise<void> {
    const chatRef = doc(this.db, COLLECTIONS.CHATS, groupId)
    const chatSnap = await getDoc(chatRef)
    if (!chatSnap.exists()) throw new Error('Chat not found')

    const participants = chatSnap.data().participants || []

    // 1. Fetch Public Keys
    const publicKeys: CryptoKey[] = []
    const participantIds: string[] = []

    // We need to ensure order matches encryptedKeys
    for (const uid of participants) {
      const uProfile = await userService.getUser(uid)
      if (uProfile?.publicKey) {
        try {
          const key = await cryptoService.importKey(uProfile.publicKey, 'public')
          publicKeys.push(key)
          participantIds.push(uid)
        } catch (e) {
          console.warn(`Invalid public key for user ${uid}`, e)
        }
      }
    }

    // 2. Encrypt
    let payload: Partial<Message> = {
      text: text, // Fallback for non-E2EE clients (optional, but here we strictly encrypt)
      type: MESSAGE_TYPES.TEXT
    }

    if (publicKeys.length > 0) {
      const encrypted = await cryptoService.encryptMessage(text, publicKeys)
      payload = {
        ...payload,
        text: '', // Clear plain text
        cipherText: encrypted.cipherText,
        encryptedKeys: {}, // Map uid -> key string
        iv: encrypted.iv,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e2ee: true as any // Custom flag
      }

      // Map keys to UIDs
      const keyMap: Record<string, string> = {}
      participantIds.forEach((uid, index) => {
        keyMap[uid] = encrypted.encryptedKeys[index]
      })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ; (payload as any).encryptedKeys = keyMap
    }

    const colRef = collection(this.db, COLLECTIONS.CHATS, groupId, COLLECTIONS.MESSAGES)
    await addDoc(colRef, {
      ...payload,
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      senderAvatar: user.photoURL || null,
      createdAt: serverTimestamp()
    })
  }

  /**
   * Confirm the deal
   */
  async confirmDeal(groupId: string, user: User): Promise<void> {
    await runTransaction(this.db, async (transaction) => {
      const chatRef = doc(this.db, COLLECTIONS.CHATS, groupId)
      const chatDoc = await transaction.get(chatRef)
      if (!chatDoc.exists()) throw 'Chat not found'

      const data = chatDoc.data() as Chat
      const participants = data.participants || []
      let confirmed = data.confirmedUsers || []

      if (!confirmed.includes(user.uid)) {
        confirmed = [...confirmed, user.uid]
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updates: Record<string, any> = { confirmedUsers: confirmed }

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
  async leaveChat(groupId: string, user: User): Promise<void> {
    const chatRef = doc(this.db, COLLECTIONS.CHATS, groupId)
    await updateDoc(chatRef, {
      participants: arrayRemove(user.uid)
    })
  }

  /**
   * Rate another user
   */
  async rateUser(
    groupId: string,
    targetUserId: string,
    score: number,
    reviewerId: string
  ): Promise<void> {
    await runTransaction(this.db, async (transaction) => {
      const chatRef = doc(this.db, COLLECTIONS.CHATS, groupId)
      const userRef = doc(this.db, COLLECTIONS.USERS, targetUserId)

      const chatDoc = await transaction.get(chatRef)
      if (!chatDoc.exists()) throw 'Chat does not exist!'

      const data = chatDoc.data() as Chat
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

      const userData = userDoc.data() as UserProfile
      const newCount = (userData.ratingCount || DEFAULTS.RATING_COUNT) + 1
      const newSum = (userData.ratingSum || DEFAULTS.RATING_SUM) + score

      transaction.update(userRef, {
        ratingCount: newCount,
        ratingSum: newSum
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: Record<string, any> = {}
      updateData[`ratings.${reviewerId}.${targetUserId}`] = score

      transaction.update(chatRef, updateData)
    })
  }

  /**
   * Check for any pending reviews for closed groups
   */
  async checkPendingReviews(user: User): Promise<string | null> {
    if (!user) return null

    // Strategy 1: Check chats where I am a participant
    const qChats = query(
      collection(this.db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', user.uid)
    )
    const chatSnaps = await getDocs(qChats)

    // Strategy 2: Check groups where I am the Host
    const qGroups = query(
      collection(this.db, COLLECTIONS.GROUPS),
      where('hostId', '==', user.uid),
      where('status', '==', GROUP_STATUS.CLOSED)
    )
    const groupSnaps = await getDocs(qGroups)

    const candidateGroupIds = new Set<string>()
    chatSnaps.forEach((d) => candidateGroupIds.add(d.id))
    groupSnaps.forEach((d) => candidateGroupIds.add(d.id))

    for (const groupId of candidateGroupIds) {
      const chatRef = doc(this.db, COLLECTIONS.CHATS, groupId)
      const chatSnap = await getDoc(chatRef)

      if (!chatSnap.exists()) continue

      const data = chatSnap.data() as Chat
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
            const gSnap = await getDoc(doc(this.db, COLLECTIONS.GROUPS, groupId))
            if (gSnap.exists() && (gSnap.data() as Group).status === GROUP_STATUS.CLOSED)
              isClosed = true
          } catch {
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

export const chatService = new ChatService()
