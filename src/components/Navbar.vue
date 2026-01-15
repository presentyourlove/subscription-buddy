<template>
  <nav
    class="sticky top-0 z-50 backdrop-blur-md bg-brand-dark/80 border-b border-white/10 shadow-lg"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo / Brand -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center gap-2">
            <img src="/icon.png" class="w-8 h-8 object-contain" alt="Logo" />
            <span
              class="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            >
              {{ $t('app.title') }}
            </span>
          </router-link>
        </div>

        <!-- Desktop Menu (Hidden on Mobile) -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link
              to="/"
              class="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {{ $t('nav.bulletin') }}
            </router-link>

            <template v-if="userStore.user">
              <router-link
                to="/create"
                class="group relative inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5"
              >
                <span class="mr-1 text-lg">+</span> {{ $t('nav.createGroup') }}
              </router-link>
              <button
                class="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium text-gray-300"
                @click="handleLogout"
              >
                {{ $t('nav.logout') }}
              </button>
              <router-link
                to="/profile"
                class="flex items-center gap-2 ml-4 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <LazyImage
                  v-if="userStore.user.photoURL"
                  :src="userStore.user.photoURL"
                  alt="Avatar"
                  image-class="w-8 h-8 rounded-full border border-white/20"
                  container-class="w-8 h-8"
                />
                <span class="text-xs text-gray-400">{{ userStore.user.displayName }}</span>
              </router-link>
            </template>

            <template v-else>
              <router-link
                to="/login"
                class="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10"
              >
                {{ $t('nav.login') }}
              </router-link>
            </template>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="-mr-2 flex md:hidden">
          <button
            class="bg-white/5 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            @click="isOpen = !isOpen"
          >
            <span class="sr-only">Opening menu</span>
            <svg
              v-if="!isOpen"
              class="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg v-else class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu (Dropdown) -->
    <div v-show="isOpen" class="md:hidden border-t border-white/10 bg-brand-dark">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          to="/"
          class="text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          @click="isOpen = false"
        >
          {{ $t('nav.bulletin') }}
        </router-link>

        <template v-if="userStore.user">
          <router-link
            to="/profile"
            class="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition-colors"
            @click="isOpen = false"
          >
            <LazyImage
              v-if="userStore.user.photoURL"
              :src="userStore.user.photoURL"
              image-class="w-8 h-8 rounded-full border border-white/20"
              container-class="w-8 h-8"
            />
            <span class="text-sm text-gray-400">{{ userStore.user.displayName }}</span>
          </router-link>
          <router-link
            to="/create"
            class="mt-3 mb-3 w-full group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30"
            @click="isOpen = false"
          >
            <span class="mr-2 text-xl">+</span> {{ $t('nav.createGroup') }}
          </router-link>
          <button
            class="text-gray-300 hover:bg-white/10 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            @click="handleLogout"
          >
            {{ $t('nav.logout') }}
          </button>
        </template>

        <template v-else>
          <router-link
            to="/login"
            class="w-full text-center text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {{ $t('nav.login') }}
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import LazyImage from './LazyImage.vue'

const userStore = useUserStore()
const router = useRouter()
const isOpen = ref(false)

const handleLogout = async () => {
  isOpen.value = false
  await userStore.logout()
  router.push('/')
}
</script>
