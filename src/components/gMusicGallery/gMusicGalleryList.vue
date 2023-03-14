<script lang="ts" setup>
import { defineComponent } from 'vue'

import gMusicGalleryItem from '@/components/gMusicGallery/gMusicGalleryItem.vue'

defineComponent({
  components: {
    gMusicGalleryItem,
  },
})

interface Props {
  title?: string
  subTitle?: string
  list: any
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
    </div>
  </div>
</template>

<style scoped></style>
