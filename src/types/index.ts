export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  ratingSum?: number
  ratingCount?: number
  createdAt?: Date | { seconds: number }
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
  createdAt?: Date | { seconds: number }
}

export interface Message {
  id?: string
  text: string
  senderId: string
  senderName: string
  senderAvatar?: string | null
  createdAt?: Date | { seconds: number }
  type: 'text' | 'image' | 'system'
}

export interface Chat {
  id?: string
  participants: string[]
  confirmedUsers?: string[]
  expireAt?: Date | { seconds: number }
  ratings?: Record<string, Record<string, number>>
  createdAt?: Date | { seconds: number }
}
