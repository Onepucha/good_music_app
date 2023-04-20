<template>
  <div v-if="!loadingStore.isLoading" class="q-page q-page__home">
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

        <q-dialog
          v-model="showModal"
          :maximized="maximizedToggle"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card>
            <q-card-section>
              <q-input
                v-model="searchQuery"
                label="Search"
                :clearable="true"
                @keyup="search"
                @clear="clearSearch"
              />
            </q-card-section>
            <q-separator />
            <q-card-section class="scroll">
              <div>
                <q-btn
                  v-for="category in categories"
                  :id="category.id"
                  :key="category.id"
                  :label="category.label"
                  :color="category.active ? 'primary' : 'secondary'"
                  @click="toggleFilter(category.id)"
                />
              </div>
              <div v-if="searchResults.length > 0">
                <p>{{ searchResults.length }} results found.</p>
                <div v-for="result in searchResults" :key="result.id">
                  <p>{{ result.title }}</p>
                  <p>{{ result.body }}</p>
                </div>
              </div>
              <div v-else>
                <p>No results found.</p>
              </div>
            </q-card-section>

            <q-card-actions>
              <q-btn label="Clear Filters" @click="clearFilters" />
              <q-btn label="Close" @click="showModal = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-btn label="Open Modal" @click="showModal = true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Artist, Chart } from 'src/types/artist'

import gMusicGalleryList from 'components/gMusicGallery/gMusicGalleryList.vue'
import {
  useArtistsStore,
  useChartsStore,
  useLoadingStore,
  useReleasesStore,
} from 'src/stores'
import { useTranslation } from 'src/composables/lang'
import axios from 'axios'

const { t } = useTranslation()
const loadingStore = useLoadingStore()

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

const searchQuery = ref('')
const searchResults = ref([])
const showModal = ref(false)
const maximizedToggle = ref(true)
const categories = ref([
  { id: 'category1', label: 'Category 1', active: false },
  { id: 'category2', label: 'Category 2', active: false },
  { id: 'category3', label: 'Category 3', active: false },
])

const search = async () => {
  if (searchQuery.value.length < 3) {
    searchResults.value = []
    return
  }
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
  const results = response.data.filter((result: any) => {
    // filter results based on active categories
    return categories.value.some((category) => {
      if (category.active) {
        return result.title.includes(category.label)
      }
      return true
    })
  })
  // filter results based on search query
  searchResults.value = results.filter((result: any) => {
    return result.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
}

const toggleFilter = (categoryId: string) => {
  const category: any = categories.value.find((c) => c.id === categoryId)
  category.active = !category.active
  search()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const clearFilters = () => {
  categories.value.forEach((category) => {
    category.active = false
  })
  search()
}

onMounted(async () => {
  loadingStore.setLoading()
  await getReleases()
  await getPopularArtist()
  await getCharts()
  loadingStore.hideLoading()
})
</script>
