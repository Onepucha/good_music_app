<script lang="ts" setup>
import { defineComponent, nextTick, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicAddPlaylistModal from '@/components/gMusicAddPlaylistModal/gMusicAddPlaylistModal.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import Songs from '@/services/songs'
import PlaylistsApi from '@/services/playlists'
import { Playlists, Song } from '@/types/artist'

import { useTranslation } from '@/composables/lang'
import { useRoute, useRouter } from 'vue-router'
import { downloadSong } from '@/utils/utils'
import { useLoadingStore, usePlayerStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()
const playerStore = usePlayerStore()
const loadingStore = useLoadingStore()

defineComponent({
  components: {
    gBack,
    gMusicSongList,
    gMusicFiltered,
    gMusicAddPlaylistModal,
    gLoader,
    DynamicIcon,
  },
})

interface Data {
  songs: Array<Song>
  songPlaylist: Song | undefined
  page: number
  albumCount: number
  isLoading: boolean
}

const data: Data = reactive({
  songs: [],
  songPlaylist: undefined,
  page: 0,
  albumCount: 24,
  isLoading: false,
})

const scrollTargetRef = ref<any>(document.createElement('div'))
const dialog = ref<boolean>(false)

const getLikedSongs = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await Songs.getLiked({
      count: data.albumCount,
      page: data.page,
    })

    if (response.data.songs.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()
    data.songs = data.songs.concat(response.data.songs)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
}

const onRecently = () => {
  console.log('Recently')
}

const shufflePlay = () => {
  // Создаем копию массива песен
  const shuffledSongs = data.songs.slice()

  // Перемешиваем массив песен
  for (let i = shuffledSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]]
  }

  playerStore.setMusicList(shuffledSongs)

  playerStore.setMusic(
    {
      _id: shuffledSongs?.at(0)?._id,
      title: shuffledSongs.at(0)?.name,
      artist: shuffledSongs?.at(0)?.artists?.at(0)?.name,
      src: shuffledSongs.at(0)?.url,
      pic: '',
      is_liked: shuffledSongs.at(0)?.is_liked,
      genres: shuffledSongs.at(0)?.genres,
    } as Song,
    0
  )
  playerStore.setPlaying(true)

  nextTick(() => {
    playerStore.player.play()
  })
}

const addPlayList = (song: Song) => {
  dialog.value = true
  data.songPlaylist = song
}

const addPlaylistSong = async (playlist: Playlists) => {
  await editPlaylist(playlist)
}

const editPlaylist = async (playlist: Playlists) => {
  try {
    let payload = {
      public: playlist.public,
      name: playlist.name,
      songs: [data.songPlaylist?._id],
      is_add_to_liked: true,
    }

    await PlaylistsApi.editPlaylist(playlist._id, payload)
    dialog.value = false
  } catch (error: unknown) {
    dialog.value = false
    console.error(error)
  }
}

const closeModal = (bool: boolean) => {
  dialog.value = bool
}

const dontPlayThis = (song: Song) => {
  console.log(song)
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const onAudioToggle = (item: { song: Song; index: number }) => {
  if (playerStore.playing && playerStore.getMusicIndex === item.index) {
    onAudioPause()
  } else {
    if (
      playerStore.getMusicIndex !== null &&
      playerStore.getMusicIndex === item.index
    ) {
      playerStore.setPlaying(true)

      nextTick(() => {
        playerStore.player.play()
      })
    } else {
      onAudioPlay({ song: item.song, index: item.index })
    }
  }
}

const onAudioPlay = (item: { song: Song; index: number }) => {
  playerStore.setMusicList(data.songs)

  playerStore.setMusic(
    {
      _id: item.song?._id,
      title: item.song?.name,
      artist: item.song?.artists?.at(0)?.name,
      src: item.song?.url,
      pic: '',
      is_liked: item.song?.is_liked,
      genres: item.song?.genres,
    } as Song,
    item.index as number
  )
  playerStore.setPlaying(true)

  nextTick(() => {
    playerStore.player.play()
  })
}

const onAudioPause = () => {
  playerStore.setPlaying(false)
  playerStore.player.pause()
}

const goToAlbum = (url: string) => {
  router.push(`/album/${url}`)
}
</script>

<template>
  <div class="q-page">
    <div class="q-page__header">
      <g-back
        :label="t('pages.songs.buttonBackSongs')"
        icon="back"
        @click.prevent="$router.go(-1)"
      />
      <DynamicIcon :size="28" name="search" />
    </div>

    <g-music-filtered
      v-if="data.songs.length"
      :label="t('pages.library.songs.label')"
      :recently="t('pages.library.songs.recently')"
      :song="data.songs?.at(0)"
      action
      @recently="onRecently"
      @toggleplay="onAudioToggle"
      @shuffle="shufflePlay"
    />

    <q-infinite-scroll
      ref="scrollTargetRef"
      :offset="250"
      @load="getLikedSongs"
    >
      <g-music-song-list
        :list="data.songs"
        @toggleplay="onAudioToggle"
        @download="downloadSong"
        @view-artist="viewArtist"
        @add-playlist="addPlayList"
        @dont-play-this="dontPlayThis"
        @go-to-album="goToAlbum"
      />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
  <g-music-add-playlist-modal
    v-model="dialog"
    :song="data.songPlaylist"
    @add-playlist-song="addPlaylistSong"
    @close-modal="closeModal"
  />
</template>
