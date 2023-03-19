<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()
</script>

<template>
  <q-card class="g-card-premium">
    <q-card-section>
      <h4>{{ t('premiumCard.title') }}</h4>
      <p class="text-s">
        {{ t('premiumCard.description') }}
      </p>
      <q-btn
        :label="t('premiumCard.button')"
        class="q-btn--white"
        rounded
        text-color="''"
        unelevated
        to="/premium"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
