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
import { useMeta } from 'quasar'
import JSZip from 'jszip'

const route = useRoute()
const router = useRouter()
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

useMeta(() => {
  return {
    title: `${t('pages.artists.titleHead')} - ${data.artist.name}`,
    meta: {
      description: {
        name: 'description',
        content: `${t('pages.artists.contentHead')} - ${data.artist.name}`,
      },
    },
  }
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

    if (object.is_add_to_liked) {
      alertStore.success(t('successLiked'))
    } else {
      alertStore.success(t('successNotLiked'))
    }
  } catch (error: unknown) {
    console.error(error)
  }
}

const onAudioToggle = (item: {
  song: Song
  id: number | string
  index: number
}) => {
  if (playerStore.playing && playerStore.getMusicIndex === item.id) {
    onAudioPause()
  } else {
    if (
      playerStore.getMusicIndex !== null &&
      playerStore.getMusicIndex === item.id
    ) {
      playerStore.setPlaying(true)

      nextTick(() => {
        playerStore.player.play()
      })
    } else {
      onAudioPlay({ song: item.song, id: item.id, index: item.index })
    }
  }
}

const onAudioPlay = async (item: {
  song: Song
  id: number | string
  index: number
}) => {
  try {
    playerStore.setLoading(true)
    const songUrl = await Songs.playSong(item.song._id)

    playerStore.setMusicList(data.artistSong || [])

    playerStore.setMusic(
      {
        _id: item.song?._id,
        title: item.song?.name,
        artist: item.song?.artists?.at(0),
        album: item.song?.album_code?.split('-')[1].trim(),
        src: songUrl.data?.url,
        pic: item.song?.cover_src,
        is_liked: item.song?.is_liked,
        genres: item.song?.genres,
      } as Song,
      item.id as number
    )
    playerStore.setPlaying(true)

    nextTick(() => {
      playerStore.player.play()
    })
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
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
    alertStore.success(t('success'))
  } catch (error: unknown) {
    dialog.value = false
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const dontPlayThis = (song: Song) => {
  console.log(song)
}

const downloadSongs = async (id: string, artist: Artist | undefined) => {
  if (authStore.user?.status === 'not-gooduser') {
    alertStore.error(t('downloadSong'))
    return false
  }

  const zip = new JSZip()
  try {
    const response = await Songs.getAll({ id: id })
    const songs = response.data.songs

    // Пройдемся по всем трекам и добавим их в архив
    for (const song of songs) {
      const songResponse = await Songs.playSong(song._id)
      const songData = songResponse.data
      const blob = new Blob([songData], { type: 'audio/mpeg' })
      zip.file(`${song.name}.mp3`, blob)
    }

    // Добавим картинку артиста в архив
    if (artist && artist.cover_src) {
      const response = await fetch(artist.cover_src)
      const blob = await response.blob()
      zip.file(`${artist.name}.jpg`, blob)
    }

    // Сгенерируем архив и скачаем его
    const zipData = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipData)
    const link = ref(document.createElement('a'))
    link.value.href = url
    link.value.download = `${data.artist?.name}.zip`
    document.body.appendChild(link.value)
    link.value.click()
    document.body.removeChild(link.value)
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
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
        @download-songs="downloadSongs"
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
