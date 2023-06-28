<script lang="ts" setup>
import { defineComponent, nextTick, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicAlbum from '@/components/gMusicAlbum/gMusicAlbum.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import Albums from '@/services/albums'
import { Album, Artist, Playlists, Song } from '@/types/artist'

import { useTranslation } from '@/composables/lang'
import { useRoute, useRouter } from 'vue-router'
import { downloadSong } from '@/utils/utils'
import { useAlertStore, useAuthStore, usePlayerStore } from '@/stores'
import PlaylistsApi from '@/services/playlists'
import { useMeta } from 'quasar'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()
const authStore = useAuthStore()

defineComponent({
  components: {
    gBack,
    gMusicAlbum,
    gMusicFiltered,
    gMusicSongListNotFound,
    gMusicPlaylistModal,
    gLoader,
    DynamicIcon,
  },
})

interface Data {
  albums: Array<Album>
  page: number
  albumCount: number
  isLoading: boolean
  songPlaylist: Array<Song> | undefined
}

const data: Data = reactive({
  albums: [],
  page: 0,
  albumCount: 24,
  isLoading: false,
  songPlaylist: undefined,
})

useMeta(() => {
  return {
    title: t('pages.library.albums.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.library.albums.contentHead'),
      },
    },
  }
})

const scrollTargetRef = ref<any>(document.createElement('div'))
const dialog = ref<boolean>(false)
const dialogCreateModal = ref<boolean>(false)

const getLikedAlbums = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await Albums.getLiked({
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

const onRecently = async (direction: string) => {
  const response: any = await Albums.getLiked({
    count: data.albumCount,
    page: 1,
    direction: direction,
  })

  data.albums = response.data.albums
}

const shufflePlay = (songs: Array<Song>, artist: Artist) => {
  // Создаем копию массива песен
  const shuffledSongs = songs.slice()

  // Перемешиваем массив песен
  for (let i = shuffledSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]]
  }

  // Обновляем массив песен
  songs = shuffledSongs

  playerStore.setMusicList(songs)

  playerStore.setMusic(
    {
      _id: songs?.at(0)?._id,
      title: songs.at(0)?.name,
      artist: artist,
      src: songs.at(0)?.url,
      pic: songs.at(0)?.cover_src,
      is_liked: songs.at(0)?.is_liked,
      genres: songs.at(0)?.genres,
    } as Song,
    0
  )
  playerStore.setPlaying(true)

  nextTick(() => {
    playerStore.player.play()
  })
}

const addPlayList = (tracks: Album) => {
  dialog.value = true

  if (tracks?.songs) {
    data.songPlaylist = tracks?.songs as Array<Song>
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
      songs: data.songPlaylist,
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

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const removeLibrary = async (album: Album) => {
  try {
    await Albums.setFollow([album._id], false)

    const indexToDelete = data.albums.findIndex(
      (item) => item._id === album._id
    )

    if (indexToDelete !== -1) {
      data.albums.splice(indexToDelete, 1)
    }

    alertStore.success(t('success'))
  } catch (error: unknown) {
    console.error(error)
    alertStore.error(t('error'))
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
        :label="t('pages.albums.buttonBackAlbums')"
        icon="back"
        @click.prevent="$router.go(-1)"
      />
      <DynamicIcon :size="28" name="search" @click.prevent="openSearch" />
    </div>

    <g-music-filtered
      :label="t('pages.albums.gMusicFiltered.label')"
      :recently="t('pages.albums.gMusicFiltered.recently')"
      @recently="onRecently"
    />

    <q-infinite-scroll
      ref="scrollTargetRef"
      :offset="250"
      @load="getLikedAlbums"
    >
      <template v-if="data.albums.length">
        <g-music-album
          v-for="album in data.albums"
          :key="album._id"
          :album="album"
          @shuffle-play="shufflePlay"
          @add-playlist="addPlayList"
          @view-artist="viewArtist"
          @remove-library="removeLibrary"
          @download="downloadSong"
        />
      </template>
      <g-music-song-list-not-found v-else />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>

    <g-music-playlist-modal
      v-if="dialog"
      :dialog="dialog"
      :song="data.songPlaylist"
      @add-playlist-song="addPlaylistSong"
      @close-modal-create="dialog = false"
    />
  </div>
</template>
