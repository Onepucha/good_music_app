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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Artist, Chart } from 'src/types/artist'

import gMusicGalleryList from 'components/gMusicGallery/gMusicGalleryList.vue'

import {
  useAlertStore,
  useArtistsStore,
  useChartsStore,
  useLoadingStore,
  useReleasesStore,
  useUsersStore,
} from 'src/stores'
import { useTranslation } from 'src/composables/lang'
import { useRoute } from 'vue-router'

const { t } = useTranslation()
const route = useRoute()
const usersStore = useUsersStore()
const loadingStore = useLoadingStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    gMusicGalleryList,
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

const emailVerify = async () => {
  try {
    data.isLoading = true

    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    if (
      route.query.token === params.token &&
      typeof params.token !== 'undefined'
    ) {
      await usersStore.emailVerify(route.query.token)
    }
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

onMounted(async () => {
  loadingStore.setLoading()
  await emailVerify()
  await getReleases()
  await getPopularArtist()
  await getCharts()
  loadingStore.hideLoading()
})
</script>
