<script lang="ts" setup>
import { computed, defineComponent } from 'vue'
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
  clickToPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subTitle: '',
  list: () => [],
  type: '',
  size: 0,
  overflow: false,
})

const emit = defineEmits(['toggleplay', 'set-liked'])

const typeRoutes = computed<string>(() => {
  return props.type === 'new-releases' ? 'album' : props.type
})

const onAudioToggle = (song: Song, index: number | string) => {
  emit('toggleplay', { song, index })
}

const setLiked = (
  isSingle: boolean,
  object: { ids: string; is_add_to_liked: boolean }
) => {
  let idsSong = [] as Array<string>
  idsSong.push(object.ids)
  emit('set-liked', false, {
    ids: object.ids,
    is_add_to_liked: object.is_add_to_liked,
  })
}
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
          :key="item._id"
          :item="item"
          :size="props.size"
          :type="typeRoutes"
          :click-to-play="clickToPlay"
          @toggleplay="onAudioToggle(item, item._id)"
          @set-liked="setLiked"
        />
      </div>
      <g-music-song-list-not-found v-else />
    </div>
  </div>
</template>

<style scoped></style>
