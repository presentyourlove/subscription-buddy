export interface UserProfile {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    ratingSum?: number
    ratingCount?: number
    createdAt?: Date | any // Firestore Timestamp
}

export interface Group {
    id?: string
    title: string
    description: string
    serviceName: string
    price: number
    slots: number
    hostId: string
    hostName: string
    hostAvatar?: string
    status: 'OPEN' | 'CLOSED' | 'FULL'
    createdAt?: Date | any
}

export interface Message {
    id?: string
    text: string
    senderId: string
    senderName: string
    senderAvatar?: string | null
    createdAt?: any
    type: 'text' | 'image' | 'system'
}

export interface Chat {
    id?: string
    participants: string[]
    confirmedUsers?: string[]
    expireAt?: any
    ratings?: Record<string, Record<string, number>>
    createdAt?: any
}
