<script lang="ts" setup>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Album, Artist, Playlists, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gAlbumProfiles from '@/components/gAlbumProfiles/gAlbumProfiles.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import gMusicComments from '@/components/gMusicComments/gMusicComments.vue'
import { useTranslation } from '@/composables/lang'
import {
  useAlertStore,
  useAuthStore,
  useLoadingStore,
  usePlayerStore,
} from '@/stores'
import { downloadSong } from '@/utils/utils'
import Albums from '@/services/albums'
import Songs from '@/services/songs'
import PlaylistsApi from '@/services/playlists'
import { useMeta } from 'quasar'
import JSZip from 'jszip'

const { t } = useTranslation()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()
const loadingStore = useLoadingStore()

defineComponent({
  components: {
    gBack,
    gAlbumProfiles,
    gMusicSongList,
    gMusicPlaylistModal,
    gMusicComments,
  },
})

useMeta(() => {
  return {
    title: t('pages.album.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.album.contentHead'),
      },
    },
  }
})

const route = useRoute()
const router = useRouter()

interface Data {
  artist: Artist | undefined
  album: Album | undefined
  albumSong: Array<Song>
  songPlaylist: Song | undefined
}

const data: Data = reactive({
  artist: {} as Artist,
  album: undefined,
  albumSong: [],
  songPlaylist: undefined,
})

const dialog = ref<boolean>(false)
const dialogCreateModal = ref<boolean>(false)

const findArtist = computed<Artist | undefined>(() => {
  return data.album?.artists?.at(0)
})

const getAlbumCode = async () => {
  try {
    let id: string | string[] = route.params.id
    const response: any = await Albums.getInfo({ id })
    data.album = response.data.album
  } catch (error: unknown) {
    console.error(error)
  }
}

const getAlbumSongs = async () => {
  try {
    let id: string | string[] = route.params.id
    const response = await Songs.getAlbumSongs({ count: 3, id: id })
    data.albumSong = response.data.songs
  } catch (error: unknown) {
    console.error(error)
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
    await Albums.setFollow(object.ids, object.is_add_to_liked)

    if (data.album && data.album.is_liked !== undefined) {
      data.album.is_liked = object.is_add_to_liked
    }

    if (object.is_add_to_liked) {
      alertStore.success(t('successLiked'))
    } else {
      alertStore.success(t('successNotLiked'))
    }
  } catch (error: unknown) {
    console.error(error)
    alertStore.error(t('error'))
  }
}

const setLikedSong = async (
  isSingle: boolean,
  object: {
    ids: string[]
    is_add_to_liked: boolean
  }
) => {
  try {
    await Songs.setLiked(object.ids, object.is_add_to_liked)

    const index = data.albumSong?.findIndex(
      (song) => song._id === object.ids.at(0)
    )

    if (data.albumSong && index !== undefined) {
      data.albumSong[index].is_liked = object.is_add_to_liked
    }

    if (object.is_add_to_liked) {
      alertStore.success(t('successLiked'))
    } else {
      alertStore.success(t('successNotLiked'))
    }
  } catch (error: unknown) {
    console.error(error)
    alertStore.error(t('error'))
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

    playerStore.setMusicList(data.albumSong || [])

    playerStore.setMusic(
      {
        _id: item.song?._id,
        title: item.song?.name,
        artist: findArtist.value,
        src: songUrl.data?.url,
        pic: item.song?.cover_src,
        is_liked: item.song?.is_liked,
        genres: item.song?.genres,
      } as Song,
      item.index as number
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

const closeModal = (bool: boolean, showCreateModal: boolean) => {
  dialog.value = bool

  if (showCreateModal) {
    dialogCreateModal.value = true
  }
}

const dontPlayThis = (song: Song) => {
  console.log(song)
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const goToAlbum = (url: string) => {
  router.push(`/album/${url}`)
}

const downloadSongs = async (id: string) => {
  const zip = new JSZip()
  try {
    const response = await Songs.getAlbumSongs({ id: id })
    const songs = response.data.songs

    // Пройдемся по всем трекам и добавим их в архив
    for (const song of songs) {
      const songResponse = await Songs.playSong(song._id)
      const songData = songResponse.data
      const blob = new Blob([songData], { type: 'audio/mpeg' })
      zip.file(`${song.name}.mp3`, blob)
    }

    // Сгенерируем архив и скачаем его
    const zipData = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipData)
    const link = ref(document.createElement('a'))
    link.value.href = url
    link.value.download = `${data.album?.name}.zip`
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
  loadingStore.setLoading()
  await getAlbumCode()
  await getAlbumSongs()
  loadingStore.hideLoading()
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

    <g-album-profiles
      :album="data?.album"
      :songs="data.albumSong"
      :song="data.albumSong.at(0)"
      @toggleplay="onAudioToggle"
      @set-liked="setLiked"
      @download-songs="downloadSongs"
      @view-artist="viewArtist"
      @go-to-album="goToAlbum"
      @add-playlist="addPlayList"
      @dont-play-this="dontPlayThis"
    />

    <g-music-song-list
      :list="data.albumSong"
      :artist="findArtist"
      :artist-id="findArtist?._id"
      :sub-title="t('pages.album.gMusicSongList.subTitle')"
      :title="t('pages.album.gMusicSongList.title')"
      @toggleplay="onAudioToggle"
      @set-liked="setLikedSong"
      @view-artist="viewArtist"
      @add-playlist="addPlayList"
      @download="downloadSong"
      @dont-play-this="dontPlayThis"
    />

    <g-music-playlist-modal
      v-if="dialog"
      :dialog="dialog"
      :song="data.songPlaylist"
      @add-playlist-song="addPlaylistSong"
      @close-modal-create="dialog = false"
    />

    <g-music-comments />
  </div>
</template>
