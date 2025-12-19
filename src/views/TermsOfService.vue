<template>
  <LegalLayout :title="$t('terms.title')">
    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('terms.introTitle') }}</h2>
      <p>{{ $t('terms.introContent') }}</p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('terms.disclaimerTitle') }}</h2>
      <ul class="list-disc list-inside ml-4 mt-2 space-y-2">
        <li>
          <strong>{{ $t('terms.riskPayment') }}</strong
          >{{ $t('terms.riskPaymentContent') }}
        </li>
        <li>
          <strong>{{ $t('terms.riskAccount') }}</strong
          >{{ $t('terms.riskAccountContent') }}
        </li>
        <li>
          <strong>{{ $t('terms.riskAccuracy') }}</strong
          >{{ $t('terms.riskAccuracyContent') }}
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('terms.rulesTitle') }}</h2>
      <p>{{ $t('terms.rulesIntro') }}</p>
      <ul class="list-disc list-inside ml-4 mt-2">
        <li>{{ $t('terms.rule1') }}</li>
        <li>{{ $t('terms.rule2') }}</li>
        <li>{{ $t('terms.rule3') }}</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-white mb-2">{{ $t('terms.changesTitle') }}</h2>
      <p>{{ $t('terms.changesContent') }}</p>
    </section>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue'
</script>
