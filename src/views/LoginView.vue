<template>
  <div class="max-w-md mx-auto px-4 py-12">
    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
      <!-- Tabs -->
      <div class="flex border-b border-white/10 mb-8">
        <button
          class="flex-1 pb-4 text-center font-medium transition-colors relative"
          :class="isLogin ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'"
          @click="isLogin = true"
        >
          {{ $t('login.tabs.login') }}
          <div
            v-if="isLogin"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"
          ></div>
        </button>
        <button
          class="flex-1 pb-4 text-center font-medium transition-colors relative"
          :class="!isLogin ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'"
          @click="isLogin = false"
        >
          {{ $t('login.tabs.register') }}
          <div
            v-if="!isLogin"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"
          ></div>
        </button>
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div v-if="!isLogin">
          <BaseInput
            v-model="displayName"
            :label="$t('login.form.displayName')"
            :placeholder="$t('login.form.displayNamePlaceholder')"
            required
          />
        </div>

        <div>
          <BaseInput
            v-model="email"
            :label="$t('login.form.email')"
            type="email"
            :placeholder="$t('login.form.emailPlaceholder')"
            required
          />
        </div>

        <div>
          <BaseInput
            v-model="password"
            :label="$t('login.form.password')"
            type="password"
            :placeholder="$t('login.form.passwordPlaceholder')"
            minlength="6"
            required
          />
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
          {{ $t(error) }}
          <!-- Ensure error is a translation key -->
        </div>

        <BaseButton type="submit" :loading="loading" :disabled="loading">
          {{ isLogin ? $t('login.form.submitLogin') : $t('login.form.submitRegister') }}
        </BaseButton>

        <!-- Terms Disclaimer -->
        <p class="text-xs text-gray-500 text-center mt-4">
          {{ isLogin ? $t('login.tabs.login') : $t('login.tabs.register') }}
          {{ $t('login.form.termsPrefix') }}
          <router-link to="/terms" class="text-purple-400 hover:text-purple-300 underline">{{
            $t('login.form.termsLink')
          }}</router-link>
          {{ $t('login.form.agree') }}
          <router-link to="/privacy" class="text-purple-400 hover:text-purple-300 underline">{{
            $t('login.form.privacyLink')
          }}</router-link>
        </p>
      </form>

      <div class="my-6 flex items-center">
        <div class="flex-grow border-t border-white/10"></div>
        <span class="flex-shrink-0 mx-4 text-gray-500 text-sm">{{ $t('login.form.or') }}</span>
        <div class="flex-grow border-t border-white/10"></div>
      </div>

      <button
        class="w-full bg-white text-gray-900 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        @click="handleGoogleLogin"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          class="w-5 h-5"
        />
        {{ $t('login.form.googleLogin') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter, useRoute } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const displayName = ref('')
const error = ref<string | null>(null)
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
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    await userStore.loginWithGoogle()
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err) {
    error.value = (err as Error).message
  }
}
</script>
