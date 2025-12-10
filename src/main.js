import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

import i18n from './i18n'

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
