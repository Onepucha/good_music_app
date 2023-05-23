<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Playlists } from '@/types/artist'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps<{
  playlist: Playlists
}>()
</script>

<template>
  <router-link
    :to="`/library/${authStore.user?.nickname}/playlists/${props.playlist._id}`"
    class="g-music-playlist"
  >
    <div
      class="g-music-playlist__picture"
      :class="{
        'g-music-playlist__picture-default': !props.playlist?.cover_src,
      }"
    >
      <img
        v-if="props.playlist?.cover_src"
        :alt="props.playlist.name"
        :src="props.playlist?.cover_src"
        loading="lazy"
      />
    </div>

    <div class="g-music-playlist__title">
      {{ props.playlist.name }}
    </div>
  </router-link>
</template>

<style scoped></style>
