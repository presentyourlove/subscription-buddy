import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './style.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Toast, {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
});
app.mount('#app');
//# sourceMappingURL=main.js.map