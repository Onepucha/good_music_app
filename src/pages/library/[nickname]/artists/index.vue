<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import gMusicSingersItem from '@/components/gMusicSingersItem/gMusicSingersItem.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import { useTranslation } from '@/composables/lang'
import { downloadSong } from '@/utils/utils'
import { Album, Artist, Playlists } from '@/types/artist'
import { useRoute, useRouter } from 'vue-router'
import Artists from '@/services/artists'
import { useAlertStore, useAuthStore } from '@/stores'
import { useMeta } from 'quasar'
import PlaylistsApi from '@/services/playlists'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()
const authStore = useAuthStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gLoader,
    gMusicFiltered,
    gMusicPlaylistModal,
    gMusicSingersItem,
    gMusicSongListNotFound,
  },
})

interface Data {
  singers: Array<Artist>
  page: number
  singersCount: number
  artistPlaylist: Array<string>
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
  artistPlaylist: [],
  isLoading: false,
})

const scrollTargetRef = ref<any>(document.createElement('div'))
const dialog = ref<boolean>(false)

useMeta(() => {
  return {
    title: t('pages.library.singers.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.library.singers.contentHead'),
      },
    },
  }
})

const onRecently = async (direction: string) => {
  const response: any = await Artists.getLiked({
    count: data.singersCount,
    page: 1,
    direction: direction,
  })

  data.singers = response.data.singers
}

const addPlayList = (artist: Artist) => {
  dialog.value = true
  if (artist.song) {
    data.artistPlaylist = artist.song
  }
}

const addPlaylistSong = async (playlist: Playlists) => {
  await editPlaylist(playlist)
}

const editPlaylist = async (playlist: Playlists) => {
  try {
    let payload = {
      public: playlist.public,
      name: playlist.name,
      songs: data.artistPlaylist,
      is_add_to_liked: true,
    }

    await PlaylistsApi.editPlaylist(playlist._id, payload)
    dialog.value = false
    alertStore.success(t('success'))
  } catch (error: unknown) {
    dialog.value = false
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const removeLibrary = async (album: Album) => {
  try {
    await Artists.setFollow([album._id], false)

    const indexToDelete = data.singers.findIndex(
      (item: Artist) => item._id === album._id
    )

    if (indexToDelete !== -1) {
      data.singers.splice(indexToDelete, 1)
      alertStore.success(t('success'))
    }
  } catch (error: unknown) {
    console.error(error)
    alertStore.error(t('error'))
  }
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

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

const openSearch = () => {
  authStore.searchModal = true
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
            <DynamicIcon name="search" :size="28" @click.prevent="openSearch" />

            <div class="q-page__header-dropdown">
              <i class="g-icon g-icon-dropdown-menu">
                <span></span>
              </i>
            </div>
          </div>
        </div>

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
          <template v-if="data.singers.length">
            <g-music-singers-item
              v-for="singer in data.singers"
              :key="singer._id"
              :singer="singer"
              @add-playlist="addPlayList"
              @remove-library="removeLibrary"
              @download="downloadSong"
              @view-artist="viewArtist"
            />
          </template>
          <g-music-song-list-not-found v-else />

          <template #loading>
            <div class="row justify-center q-my-md">
              <g-loader />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
  <g-music-playlist-modal
    v-if="dialog"
    :dialog="dialog"
    :song="data.artistPlaylist"
    @add-playlist-song="addPlaylistSong"
    @close-modal-create="dialog = false"
  />
</template>
