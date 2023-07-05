<script lang="ts" setup>
import { computed, defineComponent } from 'vue'
import { Song } from '@/types/artist'

import gMusicGalleryItem from '@/components/gMusicGallery/gMusicGalleryItem.vue'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, useAuthStore } from '@/stores'

const { t } = useTranslation()
const authStore = useAuthStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    gMusicGalleryItem,
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

const onAudioToggle = (song: Song, id: number | string, index: number) => {
  emit('toggleplay', { song, id, index })
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
        :class="{ 'g-music-gallery-list__body-overflow': overflow }"
        class="g-music-gallery-list__body"
      >
        <g-music-gallery-item
          v-for="(item, index) of list"
          :key="item._id"
          :item="item"
          :size="props.size"
          :type="typeRoutes"
          :click-to-play="clickToPlay"
          @toggleplay="onAudioToggle(item, item._id, index)"
          @set-liked="setLiked"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
