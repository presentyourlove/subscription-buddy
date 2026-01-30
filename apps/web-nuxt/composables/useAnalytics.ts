import { logEvent as firebaseLogEvent, getAnalytics } from 'firebase/analytics'
import { useFirebaseApp } from 'vuefire'

export const EVENTS = {
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  VIEW_GROUP_LIST: 'view_group_list',
  VIEW_GROUP_DETAIL: 'view_group_detail',
  CREATE_GROUP: 'create_group',
  JOIN_GROUP_CLICK: 'join_group_click'
}

export function useAnalytics() {
  const firebaseApp = useFirebaseApp()
  const analytics = getAnalytics(firebaseApp)
  const logEvent = (eventName: string, params?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Log Event: ${eventName}`, params || '')
      return
    }

    if (analytics) {
      firebaseLogEvent(analytics, eventName, params)
    }
  }

  return {
    logEvent,
    EVENTS
  }
}
