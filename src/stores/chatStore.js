import { defineStore } from 'pinia'
import { db } from '../firebase/config'
import {
    where,
    getDocs,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    updateDoc,

    arrayUnion,
    arrayRemove,
    runTransaction
} from 'firebase/firestore'

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [],
        unsubscribe: null,
        loading: false,
        error: null,
        currentGroupId: null
    }),
    actions: {
        // Join a chat room (add user to participants)
        async joinChat(groupId, user) {
            if (!user) return

            this.loading = true
            try {
                // 1. Check if chat doc exists
                const chatRef = doc(db, 'chats', groupId)
                const chatSnap = await getDoc(chatRef)

                let isNewJoin = true
                if (chatSnap.exists()) {
                    const data = chatSnap.data()
                    if (data.participants && data.participants.includes(user.uid)) {
                        isNewJoin = false
                    }
                }

                // 2. If joining a NEW group, check for pending reviews on OTHER groups
                if (isNewJoin) {
                    const pendingGroupId = await this.checkPendingReviews(user)
                    if (pendingGroupId) {
                        throw new Error(`您有尚未完成的評價 (Group ID: ${pendingGroupId})，請先完成評價！`)
                    }
                }

                // 3. Proceed to update/create
                if (!chatSnap.exists()) {
                    await setDoc(chatRef, {
                        participants: [user.uid],
                        createdAt: serverTimestamp()
                    })
                } else {
                    // Add user to participants if not already there
                    await updateDoc(chatRef, {
                        participants: arrayUnion(user.uid)
                    })
                }

            } catch (err) {
                console.error("Join chat error:", err)
                this.error = err.message
                throw err
            } finally {
                this.loading = false
            }
        },

        // Listen to realtime messages
        subscribeToMessages(groupId) {
            // Unsubscribe previous listener if exists
            if (this.unsubscribe) {
                this.unsubscribe()
                this.unsubscribe = null
            }

            this.currentGroupId = groupId
            const q = query(
                collection(db, 'chats', groupId, 'messages'),
                orderBy('createdAt', 'asc')
            )

            this.unsubscribe = onSnapshot(q, (snapshot) => {
                this.messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            }, (err) => {
                console.error("Snapshot error:", err)
                this.error = err.message
            })
        },

        // Stop listening
        unsubscribeFromMessages() {
            if (this.unsubscribe) {
                this.unsubscribe()
                this.unsubscribe = null
            }
            this.messages = []
            this.currentGroupId = null
        },

        // Send a message
        async sendMessage(text, user) {
            if (!this.currentGroupId || !user || !text.trim()) return

            try {
                const colRef = collection(db, 'chats', this.currentGroupId, 'messages')
                await addDoc(colRef, {
                    text: text,
                    senderId: user.uid,
                    senderName: user.displayName || 'Anonymous',
                    senderAvatar: user.photoURL || null,
                    createdAt: serverTimestamp(),
                    type: 'text'
                })
            } catch (err) {
                console.error("Send message error:", err)
                this.error = err.message
                throw err
            }
        },

        // Confirm Deal (Two-way confirmation)
        async confirmDeal(groupId, user) {
            try {
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
                        updates.expireAt = oneYearLater // Firestore will convert Date to Timestamp
                    }

                    transaction.update(chatRef, updates)
                })
            } catch (err) {
                console.error("Confirm deal error:", err)
                this.error = err.message
                throw err
            }
        },

        // Leave Chat (Remove from participants)
        async leaveChat(groupId, user) {
            try {
                const chatRef = doc(db, 'chats', groupId)
                await updateDoc(chatRef, {
                    participants: arrayRemove(user.uid)
                })
            } catch (err) {
                console.error("Leave chat error:", err)
                this.error = err.message
                throw err
            }
        },

        // Rate a user
        async rateUser(groupId, targetUserId, score, reviewerId) {
            try {
                await runTransaction(db, async (transaction) => {
                    const chatRef = doc(db, 'chats', groupId)
                    const userRef = doc(db, 'users', targetUserId)

                    const chatDoc = await transaction.get(chatRef)
                    if (!chatDoc.exists()) throw "Chat does not exist!"

                    const data = chatDoc.data()
                    // Check if already rated
                    if (data.ratings && data.ratings[reviewerId] && data.ratings[reviewerId][targetUserId]) {
                        throw "You have already rated this user."
                    }

                    const userDoc = await transaction.get(userRef)
                    if (!userDoc.exists()) throw "User does not exist!"

                    // 1. Update User Reputation
                    const userData = userDoc.data()
                    const newCount = (userData.ratingCount || 0) + 1
                    const newSum = (userData.ratingSum || 0) + score

                    transaction.update(userRef, {
                        ratingCount: newCount,
                        ratingSum: newSum
                    })

                    // 2. Record rating in Chat
                    // Firestore map keys cannot contain dots, so IDs are fine.
                    // Structure: ratings: { reviewerId: { targetUserId: score } }
                    const updateData = {}
                    updateData[`ratings.${reviewerId}.${targetUserId}`] = score

                    transaction.update(chatRef, updateData)
                })
            } catch (err) {
                console.error("Rate user error:", err)
                throw err
            }
        },


        // Check if user has any unrated closed chats
        async checkPendingReviews(user) {
            if (!user) return null
            try {
                // Strategy 1: Check chats where I am a participant
                const qChats = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid))
                const chatSnaps = await getDocs(qChats)

                // Strategy 2: Check groups where I am the Host (in case I haven't joined chat yet)
                const qGroups = query(collection(db, 'groups'), where('hostId', '==', user.uid), where('status', '==', 'CLOSED'))
                const groupSnaps = await getDocs(qGroups)

                // Collect all candidate Group IDs
                const candidateGroupIds = new Set()
                chatSnaps.forEach(d => candidateGroupIds.add(d.id))
                groupSnaps.forEach(d => candidateGroupIds.add(d.id))

                for (const groupId of candidateGroupIds) {
                    // Check Chat Doc
                    const chatRef = doc(db, 'chats', groupId)
                    const chatSnap = await getDoc(chatRef)

                    if (!chatSnap.exists()) continue // No chat interaction, skip

                    const data = chatSnap.data()
                    const participants = data.participants || []

                    // If I am the ONLY participant (or none), and checking myself... ignore?
                    // User Rule: "Must rate". If no one to rate, we can't block.
                    const otherParticipants = participants.filter(uid => uid !== user.uid)
                    if (otherParticipants.length === 0) continue

                    // Check Status
                    let isClosed = false

                    // 1. Chat mutual confirm
                    const confirmed = data.confirmedUsers || []
                    if (participants.length > 0 && confirmed.length >= participants.length) {
                        isClosed = true
                    }

                    // 2. Group manual status (We might have fetched it already, but getting fresh is safe)
                    if (!isClosed) {
                        // Optimize: check if we have the group doc from qGroups
                        const groupDoc = groupSnaps.docs.find(g => g.id === groupId)
                        if (groupDoc) {
                            isClosed = true // processed by qGroups query which ensures CLOSED
                        } else {
                            // Fetch if not in host list
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
            } catch (err) {
                console.error("Check pending reviews error:", err)
                return null
            }
        }
    }
})
