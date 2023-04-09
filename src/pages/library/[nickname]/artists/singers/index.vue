<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicSingersItem from '@/components/gMusicSingersItem/gMusicSingersItem.vue'
import { useTranslation } from '@/composables/lang'
import { downloadSong } from '@/utils/utils'
import { Album, Artist, Song } from '@/types/artist'
import { useRoute, useRouter } from 'vue-router'
import Artists from '@/services/artists'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gLoader,
    gMusicFiltered,
    gMusicSingersItem,
  },
})

interface Data {
  singers: Array<Artist>
  page: number
  singersCount: number
  isLoading: boolean
  name: string
  description: string
  playlistOptions: any
}

const data: Data = reactive({
  name: '',
  description: '',
  playlistOptions: {
    icon: 'public',
    label: 'Public',
  },
  singers: [],
  page: 0,
  singersCount: 24,
  isLoading: false,
})

const singers = reactive([
  {
    _id: 1,
    name: 'The Weeknd',
    songs: ['1231', '131231'],
  },
  {
    _id: 2,
    name: 'Ariana Grande',
    songs: ['1231'],
  },
])

const onRecently = () => {
  console.log('Recently')
}

const addPlayList = (song: Song) => {
  console.log(song)
}

const removeLibrary = (album: Album) => {
  console.log(album)
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const scrollTargetRef = ref<any>(document.createElement('div'))

const getLikedSingers = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await Artists.getLiked({
      count: data.singersCount,
      page: data.page,
    })

    if (response.data.artists.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()
    data.singers = data.singers.concat(response.data.artists)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            icon="back"
            :label="t('pages.library.singers.buttonBackArtists')"
            @click.prevent="$router.replace('/library')"
          />

          <div class="q-page__header-actions">
            <DynamicIcon name="search" :size="28" />

            <div class="q-page__header-dropdown">
              <i class="g-icon g-icon-dropdown-menu">
                <span></span>
              </i>
            </div>
          </div>
        </div>

        <q-tabs
          dense
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-route-tab
            :label="t('pages.library.singers.tabs.singers')"
            to="singers"
            :ripple="false"
            exact
          />
          <q-route-tab
            :label="t('pages.library.singers.tabs.albums')"
            to="albums"
            :ripple="false"
            exact
          />
        </q-tabs>

        <g-music-filtered
          :label="t('pages.library.singers.tabs.label')"
          :recently="t('pages.library.singers.tabs.recently')"
          @recently="onRecently"
        />

        <q-infinite-scroll
          ref="scrollTargetRef"
          :offset="250"
          @load="getLikedSingers"
        >
          <g-music-singers-item
            v-for="singer in data.singers"
            :key="singer._id"
            :singer="singer"
            @add-playlist="addPlayList"
            @remove-library="removeLibrary"
            @download="downloadSong"
            @view-artist="viewArtist"
          />

          <template #loading>
            <div class="row justify-center q-my-md">
              <g-loader />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>
