<template>
  <nav class="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/10 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo / Brand -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center gap-2">
            <span class="text-2xl">📱</span>
            <span class="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Subscription Buddy
            </span>
          </router-link>
        </div>

        <!-- Desktop Menu (Hidden on Mobile) -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link to="/" 
              class="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              公佈欄
            </router-link>
            
            <template v-if="userStore.user">
              <router-link to="/create" 
                class="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-purple-500/30">
                發起拼團
              </router-link>
              <button @click="handleLogout" 
                class="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium text-gray-300">
                登出
              </button>
              <div class="flex items-center gap-2 ml-4">
                <img :src="userStore.user.photoURL" class="w-8 h-8 rounded-full border border-white/20" alt="Avatar" v-if="userStore.user.photoURL">
                <span class="text-xs text-gray-400">{{ userStore.user.displayName }}</span>
              </div>
            </template>
            
            <template v-else>
              <button @click="handleLogin" 
                class="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-white/10">
                Google 登入
              </button>
            </template>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="-mr-2 flex md:hidden">
          <button @click="isOpen = !isOpen" 
            class="bg-white/5 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none">
            <span class="sr-only">Opening menu</span>
            <!-- Burger Icon -->
            <svg v-if="!isOpen" class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Close Icon -->
            <svg v-else class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu (Dropdown) -->
    <div v-show="isOpen" class="md:hidden border-t border-white/10 bg-[#0f172a]">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link to="/" @click="isOpen = false"
          class="text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
          公佈欄
        </router-link>

        <template v-if="userStore.user">
          <div class="flex items-center gap-3 px-3 py-2">
            <img :src="userStore.user.photoURL" class="w-8 h-8 rounded-full border border-white/20" v-if="userStore.user.photoURL">
            <span class="text-sm text-gray-400">{{ userStore.user.displayName }}</span>
          </div>
          <router-link to="/create" @click="isOpen = false"
            class="text-purple-400 hover:bg-purple-900/20 block px-3 py-2 rounded-md text-base font-medium">
            + 發起拼團
          </router-link>
          <button @click="handleLogout" 
            class="text-gray-300 hover:bg-white/10 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
            登出
          </button>
        </template>

        <template v-else>
          <button @click="handleLogin" 
            class="w-full text-left text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Google 登入
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const isOpen = ref(false)

const handleLogin = async () => {
  isOpen.value = false
  try {
    await userStore.loginWithGoogle()
  } catch (err) {
    alert("登入失敗: " + err.message)
  }
}

const handleLogout = async () => {
  isOpen.value = false
  await userStore.logout()
  router.push('/')
}
</script>
