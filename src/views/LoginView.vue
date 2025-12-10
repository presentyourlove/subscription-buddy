<template>
  <div class="max-w-md mx-auto px-4 py-12">
    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
      
      <!-- Tabs -->
      <div class="flex border-b border-white/10 mb-8">
        <button 
          @click="isLogin = true"
          class="flex-1 pb-4 text-center font-medium transition-colors relative"
          :class="isLogin ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'"
        >
          登入
          <div v-if="isLogin" class="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>
        </button>
        <button 
          @click="isLogin = false"
          class="flex-1 pb-4 text-center font-medium transition-colors relative"
          :class="!isLogin ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'"
        >
          註冊
          <div v-if="!isLogin" class="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-400 mb-2">暱稱</label>
          <input 
            v-model="displayName" 
            type="text" 
            required
            class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="e.g. 小明"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="example@mail.com"
          />
        </div>

        <div>
           <label class="block text-sm font-medium text-gray-400 mb-2">密碼</label>
           <input 
             v-model="password" 
             type="password" 
             required
             minlength="6"
             class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
             placeholder="至少 6 個字元"
           />
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">處理中...</span>
          <span v-else>{{ isLogin ? '登入' : '註冊' }}</span>
        </button>

        <!-- Terms Disclaimer -->
        <p class="text-xs text-gray-500 text-center mt-4">
          {{ isLogin ? '登入' : '註冊' }}即代表您同意
          <router-link to="/terms" class="text-purple-400 hover:text-purple-300 underline">服務條款</router-link>
          與
          <router-link to="/privacy" class="text-purple-400 hover:text-purple-300 underline">隱私權政策</router-link>
        </p>

      </form>

      <div class="my-6 flex items-center">
        <div class="flex-grow border-t border-white/10"></div>
        <span class="flex-shrink-0 mx-4 text-gray-500 text-sm">Or</span>
        <div class="flex-grow border-t border-white/10"></div>
      </div>

      <button 
        @click="handleGoogleLogin"
        class="w-full bg-white text-gray-900 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" />
        使用 Google 帳號登入
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const displayName = ref('')
const error = ref(null)
const loading = ref(false)

const handleSubmit = async () => {
  error.value = null
  loading.value = true
  try {
    if (isLogin.value) {
      await userStore.login(email.value, password.value)
    } else {
      await userStore.register(email.value, password.value, displayName.value)
    }
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    await userStore.loginWithGoogle()
    router.push('/')
  } catch (err) {
    error.value = err.message
  }
}
</script>
