<script setup lang="ts">
import { defineComponent } from 'vue'
import { Song } from '@/types/artist'

import gMusicAlbum from '@/components/gMusicSong/gMusicSong.vue'

defineComponent({
  components: {
    gMusicAlbum,
  },
})

interface Props {
  title?: string
  subTitle?: string
  artist: string
  artistId?: string
  list: Array<Song> | undefined
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subTitle: '',
  list: () => [],
  artist: '',
  artistId: '',
})

const emit = defineEmits(['toggleplay'])

const onAudioToggle = (song: Song, index: number) => {
  emit('toggleplay', { song, index })
}
</script>

<template>
  <div class="g-music-album-list">
    <div class="g-music-album-list__wrap">
      <div
        v-if="props.title || props.subTitle"
        class="g-music-album-list__head"
      >
        <h4 class="g-music-album-list__head-title" v-html="props.title"></h4>
        <router-link
          :to="`/artist/${props.artistId}/tracks`"
          class="g-music-album-list__head-sub-title"
        >
          {{ props.subTitle }}
        </router-link>
      </div>

      <div class="g-music-album-list__body">
        <g-music-album
          v-for="(item, index) of list"
          :key="item._id"
          :artist="artist"
          :artist-id="artistId"
          :song="item"
          @toggleplay="onAudioToggle(item, index)"
        />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<style scoped></style>
