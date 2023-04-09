<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicAlbumsItem from '@/components/gMusicAlbumsItem/gMusicAlbumsItem.vue'
import GMusicAlbumsItem from '@/components/gMusicAlbumsItem/gMusicAlbumsItem.vue'
import { useTranslation } from '@/composables/lang'
import { downloadSong } from '@/utils/utils'
import { Album, Song } from '@/types/artist'
import { useRoute, useRouter } from 'vue-router'
import Albums from '@/services/albums'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gLoader,
    gMusicFiltered,
    gMusicAlbumsItem,
  },
})

interface Data {
  albums: Array<Album>
  page: number
  albumsCount: number
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
  albums: [],
  page: 0,
  albumsCount: 24,
  isLoading: false,
})

const onRecently = () => {
  console.log('Recently')
}

const addPlayList = (song: Song) => {
  console.log(song)
}

const removeLibrary = (album: Album) => {
  console.log(album)
}

const scrollTargetRef = ref<any>(document.createElement('div'))

const getLikedAlbums = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await Albums.getLiked({
      count: data.albumsCount,
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
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            icon="back"
            :label="t('pages.library.albums.buttonBackArtists')"
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
            :label="t('pages.library.albums.tabs.singers')"
            to="singers"
            :ripple="false"
            exact
          />
          <q-route-tab
            :label="t('pages.library.albums.tabs.albums')"
            to="albums"
            :ripple="false"
            exact
          />
        </q-tabs>

        <g-music-filtered
          :label="t('pages.library.albums.tabs.label')"
          :recently="t('pages.library.albums.tabs.recently')"
          @recently="onRecently"
        />

        <q-infinite-scroll
          ref="scrollTargetRef"
          :offset="250"
          @load="getLikedAlbums"
        >
          <g-music-albums-item
            v-for="album in data.albums"
            :key="album._id"
            :album="album"
            @add-playlist="addPlayList"
            @remove-library="removeLibrary"
            @download="downloadSong"
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
