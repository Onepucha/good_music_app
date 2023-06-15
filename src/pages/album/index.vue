<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicGalleryList from '@/components/gMusicGallery/gMusicGalleryList.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { Album } from '@/types/artist'

import { useTranslation } from '@/composables/lang'
import Albums from '@/services/albums'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gMusicGalleryList,
    gLoader,
    DynamicIcon,
  },
})

interface Data {
  albums: Array<Album>
  page: number
  albumCount: number
  isLoading: boolean
}

const data: Data = reactive({
  albums: [],
  page: 0,
  albumCount: 24,
  isLoading: false,
})

const scrollTargetRef = ref<any>(document.createElement('div'))

const getAllAlbums = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await Albums.getAll({
      count: data.albumCount,
      page: data.page,
    })

    if (response.data.albums.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()
    data.albums = data.albums.concat(response.data.albums)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
}
</script>

<template>
  <div class="q-page">
    <div class="q-page__header">
      <g-back
        :label="t('pages.album.buttonBackPopularAlbums')"
        icon="back"
        @click.prevent="$router.go(-1)"
      />
      <DynamicIcon :size="28" name="search" />
    </div>

    <q-infinite-scroll ref="scrollTargetRef" :offset="250" @load="getAllAlbums">
      <g-music-gallery-list :list="data.albums" :type="'album'" />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>
