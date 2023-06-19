<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()
</script>

<template>
  <div class="g-music-not-found">
    <div class="g-music-not-found__image">4&nbsp;&nbsp;&nbsp;4</div>

    <div class="g-music-not-found__content">
      <div class="g-music-not-found__title">
        {{ t('pages.notFound.title') }}
      </div>

      <div class="g-music-not-found__description">
        {{ t('pages.notFound.description') }}
        <router-link class="g-link" to="/">
          {{ t('pages.notFound.link') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
