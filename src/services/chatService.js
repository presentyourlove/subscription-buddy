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
    where,
    orderBy,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    runTransaction
} from 'firebase/firestore'

/**
 * Service to handle Chat and Rating logic in Firestore
 * 
 * Why: Separates the persistence layer from state management.
 * Handles complex transaction logic for ratings and deal confirmation.
 */
class ChatService {
    /**
     * Join a chat group
     * Checks if user has pending reviews before allowing new joins.
     * @param {string} groupId 
     * @param {object} user - User object with uid
     */
    async joinChat(groupId, user) {
        if (!user) throw new Error("User required")

        const chatRef = doc(db, 'chats', groupId)
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
                // Return a specific error object or string that the store can handle
                throw new Error(`PENDING_REVIEW:${pendingGroupId}`)
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
     * @param {string} groupId 
     * @param {function} callback - Function to receive messages array
     * @param {function} onError - Function to handle errors
     * @returns {function} unsubscribe function
     */
    subscribeToMessages(groupId, callback, onError) {
        const q = query(
            collection(db, 'chats', groupId, 'messages'),
            orderBy('createdAt', 'asc')
        )

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            callback(messages)
        }, onError)
    }

    /**
     * Send a text message
     * @param {string} groupId 
     * @param {string} text 
     * @param {object} user 
     */
    async sendMessage(groupId, text, user) {
        const colRef = collection(db, 'chats', groupId, 'messages')
        await addDoc(colRef, {
            text: text,
            senderId: user.uid,
            senderName: user.displayName || 'Anonymous',
            senderAvatar: user.photoURL || null,
            createdAt: serverTimestamp(),
            type: 'text'
        })
    }

    /**
     * Confirm the deal (User confirmation)
     * Handles the logic for "All Confirmed" -> "Set Expiry"
     * @param {string} groupId 
     * @param {object} user 
     */
    async confirmDeal(groupId, user) {
        await runTransaction(db, async (transaction) => {
            const chatRef = doc(db, 'chats', groupId)
            const chatDoc = await transaction.get(chatRef)
            if (!chatDoc.exists()) throw "Chat not found"

            const data = chatDoc.data()
            const participants = data.participants || []
            let confirmed = data.confirmedUsers || []

            if (!confirmed.includes(user.uid)) {
                confirmed = [...confirmed, user.uid]
            }

            const updates = { confirmedUsers: confirmed }

            // Check if everyone has confirmed
            const allConfirmed = participants.length > 0 && participants.every(p => confirmed.includes(p))

            if (allConfirmed) {
                const oneYearLater = new Date()
                oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)
                updates.expireAt = oneYearLater
            }

            transaction.update(chatRef, updates)
        })
    }

    /**
     * Leave the chat
     * @param {string} groupId 
     * @param {object} user 
     */
    async leaveChat(groupId, user) {
        const chatRef = doc(db, 'chats', groupId)
        await updateDoc(chatRef, {
            participants: arrayRemove(user.uid)
        })
    }

    /**
     * Rate another user
     * Transactional update of User profile + Chat rating record
     */
    async rateUser(groupId, targetUserId, score, reviewerId) {
        await runTransaction(db, async (transaction) => {
            const chatRef = doc(db, 'chats', groupId)
            const userRef = doc(db, 'users', targetUserId)

            const chatDoc = await transaction.get(chatRef)
            if (!chatDoc.exists()) throw "Chat does not exist!"

            const data = chatDoc.data()
            if (data.ratings && data.ratings[reviewerId] && data.ratings[reviewerId][targetUserId]) {
                throw "You have already rated this user."
            }

            const userDoc = await transaction.get(userRef)
            if (!userDoc.exists()) throw "User does not exist!"

            const userData = userDoc.data()
            const newCount = (userData.ratingCount || 0) + 1
            const newSum = (userData.ratingSum || 0) + score

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
     * @param {object} user 
     * @returns {Promise<string|null>} groupId of pending review or null
     */
    async checkPendingReviews(user) {
        if (!user) return null

        // Strategy 1: Check chats where I am a participant
        const qChats = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid))
        const chatSnaps = await getDocs(qChats)

        // Strategy 2: Check groups where I am the Host
        const qGroups = query(collection(db, 'groups'), where('hostId', '==', user.uid), where('status', '==', 'CLOSED'))
        const groupSnaps = await getDocs(qGroups)

        const candidateGroupIds = new Set()
        chatSnaps.forEach(d => candidateGroupIds.add(d.id))
        groupSnaps.forEach(d => candidateGroupIds.add(d.id))

        for (const groupId of candidateGroupIds) {
            const chatRef = doc(db, 'chats', groupId)
            const chatSnap = await getDoc(chatRef)

            if (!chatSnap.exists()) continue

            const data = chatSnap.data()
            const participants = data.participants || []
            const otherParticipants = participants.filter(uid => uid !== user.uid)

            if (otherParticipants.length === 0) continue

            let isClosed = false

            // Check confirmation status
            const confirmed = data.confirmedUsers || []
            if (participants.length > 0 && confirmed.length >= participants.length) {
                isClosed = true
            }

            // Check group status
            if (!isClosed) {
                const groupDoc = groupSnaps.docs.find(g => g.id === groupId)
                if (groupDoc) {
                    isClosed = true
                } else {
                    try {
                        const gSnap = await getDoc(doc(db, 'groups', groupId))
                        if (gSnap.exists() && gSnap.data().status === 'CLOSED') isClosed = true
                    } catch (e) { }
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
