<template>
  <div class="q-page q-page__home">
    <div class="row">
      <div class="col-12 col-md-12">
        <g-music-gallery-list
          :list="data.newReleases"
          :sub-title="t('pages.home.galleryListReleases.subTitle')"
          :title="t('pages.home.galleryListReleases.title')"
          :type="'releases'"
          overflow
        />

        <g-music-gallery-list
          :list="data.popularArtists"
          :sub-title="t('pages.home.galleryListPopularArtists.subTitle')"
          :title="t('pages.home.galleryListPopularArtists.title')"
          :type="'artist'"
          overflow
        />

        <g-music-gallery-list
          :list="data.topCharts"
          :sub-title="t('pages.home.galleryListTopCharts.subTitle')"
          :title="t('pages.home.galleryListTopCharts.title')"
          :type="'chart'"
          overflow
        />

        <g-music-search-modal v-model="showModal" />

        <q-btn label="Open Modal" @click="showModal = true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Artist, Chart } from 'src/types/artist'

import gMusicGalleryList from 'components/gMusicGallery/gMusicGalleryList.vue'
import gMusicSearchModal from '@/components/gMusicSearchModal/gMusicSearchModal.vue'
import GMusicSearchModal from '@/components/gMusicSearchModal/gMusicSearchModal.vue'

import {
  useArtistsStore,
  useChartsStore,
  useLoadingStore,
  useReleasesStore,
} from 'src/stores'
import { useTranslation } from 'src/composables/lang'

const { t } = useTranslation()
const loadingStore = useLoadingStore()

defineComponent({
  components: {
    gMusicGalleryList,
    gMusicSearchModal,
  },
})

const selected = ref(null)
const options = ['Option 1', 'Option 2', 'Option 3']

interface Data {
  artists: Array<Artist>
  newReleases: string[] | undefined
  popularArtists: string[] | undefined
  topCharts: Array<Chart> | undefined
  isLoading: boolean
  isDisabled: boolean
  page: number
  artistCount: number
}

const data: Data = reactive({
  artists: [],
  newReleases: [],
  popularArtists: [],
  topCharts: [],
  isLoading: false,
  isDisabled: false,
  page: 0,
  artistCount: 24,
})

const getPopularArtist = async () => {
  const artistStore = useArtistsStore()

  try {
    const response: any = await artistStore.getAllArtists({
      count: 6,
    })

    data.popularArtists = response?.data
  } catch (error: unknown) {
    console.error(error)
  }
}

const getReleases = async () => {
  const releasesStore = useReleasesStore()

  try {
    data.newReleases = await releasesStore.getReleases()
  } catch (error: unknown) {
    console.error(error)
  }
}

const getCharts = async () => {
  const releasesStore = useChartsStore()

  try {
    data.topCharts = await releasesStore.getCharts()
  } catch (error: unknown) {
    console.error(error)
  }
}

const showModal = ref(false)

onMounted(async () => {
  loadingStore.setLoading()
  await getReleases()
  await getPopularArtist()
  await getCharts()
  loadingStore.hideLoading()
})
</script>
