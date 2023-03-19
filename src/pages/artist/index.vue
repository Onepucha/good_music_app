<script lang="ts" setup>
import { defineComponent, reactive } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicGalleryList from '@/components/gMusicGallery/gMusicGalleryList.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

import { useTranslation } from '@/composables/lang'
import { useArtistsStore } from '@/stores'

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
  artists: Array<string>
  page: number
  artistCount: number
  isLoading: boolean
}

const data: Data = reactive({
  artists: [],
  page: 0,
  artistCount: 24,
  isLoading: false,
})

const getAllArtist = async (index: number, done: () => void) => {
  const artistStore = useArtistsStore()

  try {
    data.page++
    data.isLoading = true
    const response: any = await artistStore.getAllArtists({
      count: data.artistCount,
      page: data.page,
    })

    data.artists = data.artists.concat(response.data)
    data.isLoading = false
    done()
  } catch (error) {
    data.isLoading = false
  }
}
</script>

<template>
  <div class="q-page">
    <div class="q-page__header">
      <g-back
        :label="t('pages.artists.buttonBackPopularArtists')"
        icon="back"
        @click.prevent="$router.go(-1)"
      />
      <DynamicIcon :size="28" name="search" />
    </div>

    <q-infinite-scroll :offset="250" @load="getAllArtist">
      <g-music-gallery-list :list="data.artists" :type="'artist'" />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>
