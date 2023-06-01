<script lang="ts" setup>
import { defineComponent } from 'vue'
import { Song } from '@/types/artist'

import gMusicGalleryItem from '@/components/gMusicGallery/gMusicGalleryItem.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'

defineComponent({
  components: {
    gMusicGalleryItem,
    gMusicSongListNotFound,
  },
})

interface Props {
  title?: string
  subTitle?: string
  list: Array<Song>
  type: string
  size?: number
  overflow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subTitle: '',
  list: () => [],
  type: '',
  size: 0,
  overflow: false,
})
</script>

<template>
  <div class="g-music-gallery-list">
    <div class="g-music-gallery-list__wrap">
      <div
        v-if="props.title || props.subTitle"
        class="g-music-gallery-list__head"
      >
        <h4 class="g-music-gallery-list__head-title" v-html="props.title"></h4>
        <router-link
          :to="props.type"
          class="g-music-gallery-list__head-sub-title"
        >
          {{ props.subTitle }}
        </router-link>
      </div>

      <div
        v-if="list.length"
        :class="{ 'g-music-gallery-list__body-overflow': overflow }"
        class="g-music-gallery-list__body"
      >
        <g-music-gallery-item
          v-for="item of list"
          :key="item.id"
          :item="item"
          :size="props.size"
          :type="props.type"
        />
      </div>
      <g-music-song-list-not-found v-else />
    </div>
  </div>
</template>

<style scoped></style>
