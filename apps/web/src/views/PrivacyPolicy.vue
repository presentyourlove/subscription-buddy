<template>
  <LegalLayout :title="$t('privacy.title')">
    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('privacy.collectTitle') }}</h2>
      <p>{{ $t('privacy.collectIntro') }}</p>
      <ul class="list-disc list-inside ml-4 mt-2">
        <li>{{ $t('privacy.collectEmail') }}</li>
        <li>{{ $t('privacy.collectName') }}</li>
        <li>{{ $t('privacy.collectPhoto') }}</li>
        <li>{{ $t('privacy.collectUid') }}</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('privacy.usageTitle') }}</h2>
      <p>{{ $t('privacy.usageIntro') }}</p>
      <ul class="list-disc list-inside ml-4 mt-2">
        <li>{{ $t('privacy.usageIdentity') }}</li>
        <li>{{ $t('privacy.usageDisplay') }}</li>
        <li>{{ $t('privacy.usageReputation') }}</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('privacy.shareTitle') }}</h2>
      <p>{{ $t('privacy.shareIntro') }}</p>
      <ul class="list-disc list-inside ml-4 mt-2">
        <li>
          <strong>{{ $t('privacy.shareMember') }}</strong
          >{{ $t('privacy.shareMemberContent') }}
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('privacy.securityTitle') }}</h2>
      <p>{{ $t('privacy.securityContent') }}</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('privacy.contactTitle') }}</h2>
      <i18n-t keypath="privacy.contactContent" tag="p">
        <template #link>
          <a
            href="mailto:presentyourlove@yahoo.com"
            class="text-purple-400 hover:text-purple-300 underline"
            >Email</a
          >
        </template>
      </i18n-t>
    </section>
  </LegalLayout>
</template>

<script setup lang="ts">
import LegalLayout from '../components/LegalLayout.vue'
</script>
