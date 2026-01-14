import { createRouter, createWebHashHistory } from 'vue-router';
import { watch } from 'vue';
import HomeView from '../views/HomeView.vue';
import { useUserStore } from '../stores/userStore';
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/create',
        name: 'create',
        component: () => import('../views/CreateGroupView.vue')
    },
    {
        path: '/groups/:id',
        name: 'group-detail',
        component: () => import('../views/GroupDetailView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/chat/:id',
        name: 'chat',
        component: () => import('../views/ChatRoomView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/privacy',
        name: 'privacy',
        component: () => import('../views/PrivacyPolicy.vue')
    },
    {
        path: '/terms',
        name: 'terms',
        component: () => import('../views/TermsOfService.vue')
    },
    {
        path: '/admin',
        component: () => import('../views/admin/AdminLayout.vue'), // Basic Admin Layout
        meta: { requiresAuth: true, requiresAdmin: true }, // Placeholder for auth logic
        children: [
            {
                path: '',
                name: 'admin-dashboard',
                component: () => import('../views/admin/DashboardView.vue')
            },
            {
                path: 'groups',
                name: 'admin-groups',
                component: () => import('../views/admin/GroupsView.vue')
            }
        ]
    }
];
const router = createRouter({
    // Use WebHashHistory for static file deployment compatibility (GitHub Pages / Firebase Hosting).
    // This avoids server-side rewrite rule dependencies.
    history: createWebHashHistory(),
    routes
});
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    // Wait for Firebase Auth to initialize
    if (!userStore.authReady) {
        await new Promise((resolve) => {
            const unwatch = watch(() => userStore.authReady, (ready) => {
                if (ready) {
                    unwatch();
                    resolve();
                }
            }, { immediate: true });
        });
    }
    // Check requiresAuth
    if (to.meta.requiresAuth && !userStore.user) {
        return next({ name: 'login', query: { redirect: to.fullPath } });
    }
    // Check requiresAdmin (Placeholder)
    if (to.meta.requiresAdmin) {
        // TODO: Implement actual Admin check logic (e.g. check userStore.user.email or claims)
        /*
        if (userStore.user.email !== 'admin@example.com') {
           return next({ name: 'home' })
        }
        */
    }
    next();
});
export default router;
//# sourceMappingURL=index.js.map