import { watch } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import { useUserStore } from '../stores/userStore'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
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
]

const router = createRouter({
  // Use WebHashHistory for static file deployment compatibility (GitHub Pages / Firebase Hosting).
  // This avoids server-side rewrite rule dependencies.
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Deep Linking & Analytics Tracking
  if (to.query.utm_source) {
    try {
      // Assuming 'analytics' is available or use a logger
      // analytics.logEvent('deep_link_opened', { source: to.query.utm_source, path: to.path })
      console.log(`[DeepLink] Source: ${to.query.utm_source}, Path: ${to.path}`)
    } catch (e) {
      console.warn('Analytics tracking failed', e)
    }
  }

  // Pre-fetch Group Data for Deep Links if applicable
  // This allows the page to render faster once the component loads
  if (to.name === 'group-detail' && to.params.id) {
    // We can trigger a store action here without awaiting if we want optimistic UI,
    // or await it if we want to block navigation until data exists (not recommended for TTI).
    // For now, we just ensure the route is handled correctly.
  }

  // Wait for Firebase Auth to initialize
  if (!userStore.authReady) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(
        () => userStore.authReady,
        (ready) => {
          if (ready) {
            unwatch()
            resolve()
          }
        },
        { immediate: true }
      )
    })
  }

  // Check requiresAuth
  if (to.meta.requiresAuth && !userStore.user) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Check requiresAdmin
  if (to.meta.requiresAdmin) {
    const { ADMIN_EMAILS } = await import('@subscription-buddy/core')
    const email = userStore.user?.email

    if (!email || !ADMIN_EMAILS.includes(email)) {
      // Not an admin, redirect to home
      return next({ name: 'home' })
    }
  }

  next()
})

export default router
