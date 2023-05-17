<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Artist, Playlists, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gMusicGenericArtist from '@/components/gMusicGenericArtist/gMusicGenericArtist.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import { useTranslation } from '@/composables/lang'
import {
  useAlertStore,
  useArtistsStore,
  useAuthStore,
  usePlayerStore,
} from '@/stores'
import { downloadSong } from '@/utils/utils'
import Songs from '@/services/songs'
import PlaylistsApi from '@/services/playlists'

const { t } = useTranslation()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    gBack,
    gMusicGenericArtist,
    gMusicSongList,
    gMusicPlaylistModal,
  },
})

const route = useRoute()
const router = useRouter()

const isLoading = ref<boolean>(true)

interface Data {
  artist: Artist
  artistSong: Array<Song>
  songPlaylist: Song | undefined
  isLoading: boolean
}

const data: Data = reactive({
  artist: {} as Artist,
  artistSong: [],
  songPlaylist: undefined,
  isLoading: false,
})

const dialog = ref<boolean>(false)

const getArtistCode = async () => {
  const artistStore = useArtistsStore()

  try {
    let id: string | string[] = route.params.id
    const response: any = await artistStore.getArtistCode(id)

    data.artist = response.data.artist
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
  }
}

const getArtistSongs = async () => {
  try {
    let id: string | string[] = route.params.id
    const response: any = await Songs.getAll({ count: 3, id: id })

    data.artistSong = response.data.songs
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
  }
}

const addFollow = async (object: { follow: boolean; artist: Artist }) => {
  const artistStore = useArtistsStore()
  const alertStore = useAlertStore()

  try {
    data.isLoading = true

    await artistStore.saveFollowArtist(object.follow, [object.artist._id])

    if (data.artist && data.artist.is_liked !== undefined) {
      data.artist.is_liked = object.follow
    }

    data.isLoading = false
  } catch (error: unknown) {
    console.error(error)
    data.isLoading = false
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const setLiked = async (
  isSingle: boolean,
  object: {
    ids: string[]
    is_add_to_liked: boolean
  }
) => {
  try {
    await Songs.setLiked(object.ids, object.is_add_to_liked)

    const index = data.artistSong?.findIndex(
      (song) => song._id === object.ids.at(0)
    )

    if (data.artistSong && index !== undefined) {
      data.artistSong[index].is_liked = object.is_add_to_liked
    }
  } catch (error: unknown) {
    console.error(error)
  }
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

const onAudioPlay = async (item: { song: Song; index: number }) => {
  try {
    const songUrl = await Songs.playSong(item.song._id)

    playerStore.setMusicList(data.artistSong || [])

    playerStore.setMusic(
      {
        _id: item.song?._id,
        title: item.song?.name,
        artist: data?.artist?.name,
        src: songUrl.data?.url,
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
  } catch (error: any) {
    alertStore.error(error)
  }
}

const onAudioPause = () => {
  playerStore.setPlaying(false)
  playerStore.player.pause()
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const goToAlbum = (artist: Artist) => {
  router.push(`/album/${artist._id}`)
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

onMounted(async () => {
  await getArtistCode()
  await getArtistSongs()
  playerStore.setArtistName(data.artist)
  isLoading.value = false
})
</script>

<template>
  <div class="q-page">
    <div class="q-page__header">
      <g-back icon="back" @click.prevent="$router.go(-1)" />
      <i class="g-icon g-icon-dropdown-menu">
        <span></span>
      </i>
    </div>

    <template v-if="!isLoading">
      <g-music-generic-artist
        :artist="data?.artist"
        :songs="data.artistSong"
        :song="data.artistSong.at(0)"
        @add-follow="addFollow"
        @toggleplay="onAudioToggle"
        @download="downloadSong"
        @add-playlist="addPlayList"
        @dont-play-this="dontPlayThis"
      />

      <g-music-song-list
        :list="data.artistSong"
        :artist="playerStore.artist"
        :artist-id="data.artist?._id"
        :sub-title="t('pages.artists.gMusicSongList.subTitle')"
        :title="t('pages.artists.gMusicSongList.title')"
        @toggleplay="onAudioToggle"
        @download="downloadSong"
        @go-to-album="goToAlbum"
        @set-liked="setLiked"
        @view-artist="viewArtist"
        @add-playlist="addPlayList"
        @dont-play-this="dontPlayThis"
      />

      <g-music-playlist-modal
        v-if="dialog"
        :dialog="dialog"
        :song="data.songPlaylist"
        @add-playlist-song="addPlaylistSong"
        @close-modal-create="dialog = false"
      />
    </template>
  </div>
</template>
