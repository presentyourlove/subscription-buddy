<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
      <h1
        class="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
      >
        {{ $t('create.title') }}
      </h1>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Service Name -->
        <!-- Service Name -->
        <div>
          <BaseInput
            v-model="form.title"
            :label="$t('create.form.serviceName')"
            :placeholder="$t('create.form.servicePlaceholder')"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <BaseTextarea
            v-model="form.description"
            :label="$t('create.form.description')"
            required
            rows="3"
            :placeholder="$t('create.form.descPlaceholder')"
          />
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Price -->
          <div>
            <BaseInput
              v-model.number="form.price"
              :label="$t('create.form.price')"
              type="number"
              required
              min="0"
            >
              <template #prefix>$</template>
            </BaseInput>
          </div>

          <!-- Slots -->
          <div>
            <BaseInput
              v-model.number="form.slots"
              :label="$t('create.form.slots')"
              type="number"
              required
              min="1"
              :max="DEFAULTS.MAX_SLOTS"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <BaseButton type="submit" :loading="groupStore.loading" :disabled="groupStore.loading">
            <span v-if="groupStore.loading">{{ $t('create.form.processing') }}</span>
            <span v-else>{{ $t('create.form.submit') }}</span>
          </BaseButton>
        </div>

        <p v-if="groupStore.error" class="text-red-400 text-center text-sm">
          {{ groupStore.error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'
import { useI18n } from 'vue-i18n'

import { useChatStore } from '../stores/chatStore'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTextarea from '../components/BaseTextarea.vue'

const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()
const chatStore = useChatStore() // Init chatStore
const { t } = useI18n()
import { DEFAULTS } from '../utils/constants'

const form = reactive({
  title: '',
  description: '',
  price: '',
  slots: ''
})

const handleSubmit = async () => {
  if (!userStore.user) {
    alert(t('create.form.loginRequired'))
    return
  }

  try {
    // Check for pending reviews
    const pendingGroupId = await chatStore.checkPendingReviews(userStore.user)
    if (pendingGroupId) {
      if (confirm(t('create.form.pendingReview', { groupId: pendingGroupId }))) {
        router.push(`/chat/${pendingGroupId}`)
      }
      return
    }

    await groupStore.addGroup({
      ...form, // Flatten reactive object
      hostId: userStore.user.uid,
      hostName: userStore.user.displayName || t('common.anonymous'),
      hostAvatar: userStore.user.photoURL || ''
    })
    alert(t('create.form.success'))
    router.push('/')
  } catch (err) {
    // Error is handled in store, simply stay on page to show it
    console.error(err)
  }
}
</script>
