<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Album } from '@/types/artist'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps<{
  album: Album
}>()
</script>

<template>
  <router-link :to="`album/${props.album._id}`" class="g-music-album-item">
    <div
      class="g-music-album-item__picture"
      :class="{
        'g-music-playlist__picture-default': !props.album?.cover_src,
      }"
    >
      <img
        v-if="props.album?.cover_src"
        :alt="props.album.name"
        :src="props.album?.cover_src"
        loading="lazy"
      />
    </div>

    <div class="g-music-album-item__content">
      <div class="g-music-album-item__title">
        {{ props.album.name }}
      </div>

      <div
        v-if="props.album?.artists?.at(0)?.name"
        class="g-music-album-item__artist-name"
      >
        {{ props.album.artists.at(0).name }}
      </div>

      <div
        v-if="props.album?.release_date"
        class="g-music-album-item__release-date"
      >
        {{ props.album?.release_date }}
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
