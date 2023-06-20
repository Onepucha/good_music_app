<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicGalleryList from '@/components/gMusicGallery/gMusicGalleryList.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

import { useTranslation } from '@/composables/lang'
import { useArtistsStore, useAuthStore } from '@/stores'

const { t } = useTranslation()
const authStore = useAuthStore()

defineComponent({
  components: {
    gBack,
    gMusicGalleryList,
    gMusicSongListNotFound,
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

const scrollTargetRef = ref<any>(document.createElement('div'))
const noMoreItems = ref<boolean>(false)

const getAllArtist = async (index: number, done: () => void) => {
  const artistStore = useArtistsStore()

  try {
    data.page++
    const response: any = await artistStore.getAllArtists({
      count: data.artistCount,
      page: data.page,
    })

    if (response.data.length === 0) {
      scrollTargetRef.value.stop()
      noMoreItems.value = true
    } else {
      data.artists = data.artists.concat(response.data)
    }

    done()
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
}

const openSearch = () => {
  authStore.searchModal = true
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
      <DynamicIcon :size="28" name="search" @click.prevent="openSearch" />
    </div>

    <q-infinite-scroll ref="scrollTargetRef" :offset="250" @load="getAllArtist">
      <g-music-gallery-list :list="data.artists" :type="'artist'" />

      <g-music-song-list-not-found v-if="noMoreItems" />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>
