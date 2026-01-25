import { fetchAndActivate, getRemoteConfig, getValue } from 'firebase/remote-config'
import { firebaseApp } from '@/services/firebase/config' // Assuming this exists or similar

// Initialize Remote Config
const remoteConfig = getRemoteConfig(firebaseApp)

// Set default values
remoteConfig.defaultConfig = {
    enable_new_chat_ui: false,
    promo_banner_text: 'Welcome to Subscription Buddy!',
    maintenance_mode: false,
    max_groups_per_user: 5
}

// Set fetch interval (Dev: 0, Prod: 1 hour)
remoteConfig.settings.minimumFetchIntervalMillis = import.meta.env.DEV ? 0 : 3600000

export const configService = {
    /**
     * Initialize and fetch config
     */
    async init() {
        try {
            await fetchAndActivate(remoteConfig)
            console.log('Remote Config fetched and activated')
        } catch (error) {
            console.error('Failed to fetch remote config', error)
        }
    },

    /**
     * Get Boolean Feature Flag
     */
    getFeatureFlag(key: string): boolean {
        return getValue(remoteConfig, key).asBoolean()
    },

    /**
     * Get String Config
     */
    getString(key: string): string {
        return getValue(remoteConfig, key).asString()
    },

    /**
     * Get Number Config
     */
    getNumber(key: string): number {
        return getValue(remoteConfig, key).asNumber()
    }
}
