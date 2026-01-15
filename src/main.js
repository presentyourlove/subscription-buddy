import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './style.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { createHead } from '@unhead/vue';
const app = createApp(App);
const head = createHead();
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(head);
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
/**
 * Global Error Handling
 */
app.config.errorHandler = (err, instance, info) => {
    console.error('[Global Error]', err);
    console.error('Instance:', instance);
    console.error('Info:', info);
    // Use Toast directly via options API style or ensure setup is done.
    // Since we use app.use(Toast), we can try to access it if exposed, but for safety in global handler:
    // Using console only to avoid circular dependency or context issues for now, or use window.alert if critical
};
app.mount('#app');
//# sourceMappingURL=main.js.map