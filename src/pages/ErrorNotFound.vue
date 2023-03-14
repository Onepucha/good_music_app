<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()
</script>

<template>
  <div>
    <h1>{{ t('pages.notFound.title') }}</h1>

    <q-btn
      class="q-mt-xl"
      color="white"
      text-color="blue"
      unelevated
      to="/"
      label="Go Home"
      no-caps
    />
  </div>
</template>
