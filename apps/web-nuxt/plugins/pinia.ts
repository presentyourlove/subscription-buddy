import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
    // @ts-ignore
    nuxtApp.$pinia.use(createPersistedState())
})
