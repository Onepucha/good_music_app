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
import { Artist, Playlists, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gSongInfo from '@/components/gSongInfo/gSongInfo.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import { downloadSong } from '@/utils/utils'
import { useAlertStore, usePlayerStore } from '@/stores'
import PlaylistsApi from '@/services/playlists'
import { useMeta } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gSongInfo,
    gMusicSongList,
    gMusicPlaylistModal,
  },
})

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

const isLoading = ref<boolean>(true)

interface Data {
  song: Song | undefined
  artistSong: Array<Song>
  songPlaylist: Song | undefined
  durationSong: string | undefined
}

const data: Data = reactive({
  song: undefined,
  artistSong: [],
  songPlaylist: undefined,
  durationSong: undefined,
})

useMeta(() => {
  return {
    title: `${t('pages.artists.titleHead')} - ${data.song?.name}`,
    meta: {
      description: {
        name: 'description',
        content: `${t('pages.artists.contentHead')} - ${data.song?.name}`,
      },
    },
  }
})

const dialog = ref<boolean>(false)

const findArtist = computed<any>(() => {
  return data.song?.artists?.at(0)
})

const getSong = async () => {
  try {
    let id: string | string[] = route.params.code
    const response: any = await Songs.get(id)

    data.song = response.data.song
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

    if (isSingle) {
      if (data.song) {
        data.song.is_liked = object.is_add_to_liked
      }
    } else {
      if (
        data.song &&
        data.song._id === data.artistSong[index]._id &&
        index !== undefined
      ) {
        data.song.is_liked = object.is_add_to_liked
      }

      if (data.artistSong && index !== undefined) {
        data.artistSong[index].is_liked = object.is_add_to_liked
      }
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
        artist: item.song?.artists?.at(0),
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

const dontPlayThis = (song: Song) => {
  console.log(song)
}

const getCurrentSong = async () => {
  if (data.song?._id) {
    const response = await Songs.playSong(data.song?._id)
    console.log(response.data)

    const audioFile = new Audio(response.data?.url)

    audioFile.addEventListener('loadedmetadata', () => {
      const date = new Date(audioFile.duration * 1000)
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      data.durationSong = `${minutes}:${seconds} mins`
    })
  }
}

onMounted(async () => {
  await getSong()
  await getArtistSongs()
  await getCurrentSong()

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
      <g-song-info
        :song="data.song"
        :artist="findArtist"
        :duration-song="data.durationSong"
        @set-liked="setLiked"
        @add-playlist="addPlayList"
        @download="downloadSong"
        @dont-play-this="dontPlayThis"
        @view-artist="viewArtist"
        @go-to-album="goToAlbum"
        @toggleplay="onAudioToggle"
      />

      <g-music-song-list
        :list="data.artistSong"
        :artist="findArtist"
        :artist-id="findArtist?._id"
        :sub-title="t('pages.artists.gMusicSongListTrack.subTitle')"
        :title="t('pages.artists.gMusicSongListTrack.title')"
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
