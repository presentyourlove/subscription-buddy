import { POSITION, TYPE, useToast } from 'vue-toastification'

const DEFAULT_TIMEOUT = 5000

/**
 * Composable for unified notification/toast system
 * Replaces alert() with modern toast notifications
 */
export function useNotification() {
  const toast = useToast()

  return {
    /**
     * Show success notification
     */
    success(message: string, timeout = DEFAULT_TIMEOUT) {
      toast(message, {
        type: TYPE.SUCCESS,
        position: POSITION.TOP_RIGHT,
        timeout
      })
    },

    /**
     * Show error notification
     */
    error(message: string, timeout = DEFAULT_TIMEOUT) {
      toast(message, {
        type: TYPE.ERROR,
        position: POSITION.TOP_RIGHT,
        timeout
      })
    },

    /**
     * Show warning notification
     */
    warning(message: string, timeout = DEFAULT_TIMEOUT) {
      toast(message, {
        type: TYPE.WARNING,
        position: POSITION.TOP_RIGHT,
        timeout
      })
    },

    /**
     * Show info notification
     */
    info(message: string, timeout = DEFAULT_TIMEOUT) {
      toast(message, {
        type: TYPE.INFO,
        position: POSITION.TOP_RIGHT,
        timeout
      })
    }
  }
}
