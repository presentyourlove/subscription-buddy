/**
 * Application Constants
 *
 * Why: Centralize "magic numbers" and strings to improve maintainability and avoid typos.
 * Follows the DRY (Don't Repeat Yourself) principle.
 */

export const COLLECTIONS = {
  GROUPS: 'groups',
  CHATS: 'chats',
  USERS: 'users',
  MESSAGES: 'messages'
} as const

export const GROUP_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  FULL: 'FULL'
} as const

export const MESSAGE_TYPES = {
  TEXT: 'text'
} as const

export const ERROR_CODES = {
  PENDING_REVIEW: 'PENDING_REVIEW'
} as const

export const DEFAULTS = {
  EXPIRY_YEARS: 1,
  RATING_COUNT: 0,
  RATING_SUM: 0,
  MAX_RATING: 5,
  MAX_SLOTS: 10
} as const

export const FIREBASE_AUTH_CODES = {
  EMAIL_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  WEAK_PASSWORD: 'auth/weak-password',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  POPUP_CLOSED: 'auth/popup-closed-by-user'
} as const

export const ADMIN_EMAILS = ['jasonwth0928@gmail.com']
