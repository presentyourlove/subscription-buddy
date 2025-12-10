import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    // Use createWebHashHistory for simpler static deployment (GitHub Pages) compliance without server rewrite rule
    // OR createWebHistory if base is handled correctly, but Hash is safest for "drag and drop" static hosting.
    // Given user wants simple "static file" deployment, Hash mode is robust.
    // However, Vite base: './' works with WebHistory if server supports it.
    // Let's stick to WebHistory based on my plan, but mention Hash if issues arise.
    // Actually, for "put in a subfolder" without server config, WebHashHistory is SAFER.
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/create',
            name: 'create',
            component: () => import('../views/CreateGroupView.vue')
        }
    ]
})

export default router
