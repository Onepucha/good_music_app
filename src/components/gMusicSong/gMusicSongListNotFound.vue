<script setup lang="ts">
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()
</script>

<template>
  <div class="g-music-song-list-not-found">
    <div class="g-music-song-list-not-found__images">
      <img src="src/assets/images/not-found-songs.svg" alt="not-found-songs" />
    </div>
    <h4 class="g-music-song-list-not-found__title">
      {{ t('gMusicSongListNotFound.title') }}
    </h4>
    <p
      class="g-music-song-list-not-found__description"
      v-html="t('gMusicSongListNotFound.description')"
    ></p>
  </div>
</template>

<style scoped></style>
