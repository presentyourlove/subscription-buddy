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
        <div>
          <BaseInput
            v-model="form.title"
            :label="$t('create.form.serviceName')"
            :placeholder="$t('create.form.servicePlaceholder')"
            :error="errors.title"
            @blur="handleValidateField('title', form.title)"
          />
        </div>

        <!-- Description -->
        <div>
          <BaseTextarea
            v-model="form.description"
            :label="$t('create.form.description')"
            rows="3"
            :placeholder="$t('create.form.descPlaceholder')"
            :error="errors.description"
            @blur="handleValidateField('description', form.description)"
          />
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Price -->
          <div>
            <BaseInput
              v-model.number="form.price"
              :label="$t('create.form.price')"
              type="number"
              min="0"
              :error="errors.price"
              @blur="handleValidateField('price', form.price)"
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
              min="1"
              :max="DEFAULTS.MAX_SLOTS"
              :error="errors.slots"
              @blur="handleValidateField('slots', form.slots)"
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
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseTextarea from '../components/BaseTextarea.vue'
import { useFormValidation } from '../composables/useFormValidation'
import { useNotification } from '../composables/useNotification'
import { createGroupSchema, DEFAULTS } from '@subscription-buddy/core'
import { useChatStore } from '../stores/chatStore'
import { useGroupStore } from '../stores/groupStore'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()
const chatStore = useChatStore()
const { t } = useI18n()
const notification = useNotification()

const { errors: validationErrors, validate, validateField } = useFormValidation(createGroupSchema)
const errors = ref<Record<string, string | undefined>>({})

const form = reactive({
  title: '',
  description: '',
  price: '' as unknown as number,
  slots: '' as unknown as number
})

const handleValidateField = (field: string, value: unknown) => {
  validateField(field as never, value)
  errors.value = { ...validationErrors }
}

const handleSubmit = async () => {
  if (!userStore.user) {
    notification.error(t('create.form.loginRequired'))
    router.push('/login')
    return
  }

  // 驗證表單
  const formData = {
    title: form.title,
    description: form.description,
    price: Number(form.price),
    slots: Number(form.slots)
  }

  if (!validate(formData)) {
    errors.value = { ...validationErrors }
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
      title: form.title,
      description: form.description,
      price: Number(form.price),
      slots: Number(form.slots),
      serviceName: form.title,
      hostId: userStore.user.uid,
      hostName: userStore.user.displayName || t('common.anonymous'),
      hostAvatar: userStore.user.photoURL || ''
    })
    notification.success(t('create.form.success'))
    router.push('/')
  } catch (err) {
    console.error(err)
  }
}
</script>
