export interface BaseDTO {
    id: string
    createdAt?: string
    updatedAt?: string
}

export interface UserDTO extends BaseDTO {
    displayName: string
    photoURL?: string
    email?: string // Only if authorized/permitted
}

export interface GroupDTO extends BaseDTO {
    name: string
    description: string
    platform: string
    price: number
    cycle: string
    currency: string
    maxMembers: number
    currentMembers: number
    ownerId: string
    status: 'active' | 'full' | 'closed'
    tags?: string[]
}
