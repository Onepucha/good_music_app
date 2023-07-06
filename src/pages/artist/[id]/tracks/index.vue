<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { Album, Artist, Playlists, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import { useRoute, useRouter } from 'vue-router'
import { useAlertStore, useArtistsStore, usePlayerStore } from '@/stores'
import { downloadSong } from '@/utils/utils'
import PlaylistsApi from '@/services/playlists'
import { useMeta } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gLoader,
    gMusicSongList,
    gMusicPlaylistModal,
  },
})

useMeta(() => {
  return {
    title: `${t('pages.artists.titleHead')} - Tracks`,
    meta: {
      description: {
        name: 'description',
        content: `${t('pages.artists.contentHead')} - Tracks`,
      },
    },
  }
})

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

const isLoading = ref<boolean>(true)

interface Data {
  artist: Artist | undefined
  page: number
  songPlaylist: Song | undefined
}

const data: Data = reactive({
  artist: undefined,
  page: 0,
  songPlaylist: undefined,
})

const dialog = ref<boolean>(false)

const state = reactive({
  artistSong: [] as Array<Song>,
  page: 1,
  loading: false,
  finished: false,
})

const getArtistSongs = async () => {
  if (state.loading || state.finished) return
  state.loading = true

  try {
    let id: string | string[] = route.params.id

    const response = await Songs.getAll({
      id: id,
      page: state.page,
    })

    const newSongs = response.data.songs
    if (newSongs.length === 0) {
      state.finished = true
    } else {
      state.artistSong = [...state.artistSong, ...newSongs]
      state.page += 1
    }
  } catch (error) {
    console.error(error)
  } finally {
    state.loading = false
  }
}

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

const setLiked = async (
  isSingle: boolean,
  object: {
    ids: string[]
    is_add_to_liked: boolean
  }
) => {
  try {
    await Songs.setLiked(object.ids, object.is_add_to_liked)

    const index = state.artistSong?.findIndex(
      (song) => song._id === object.ids.at(0)
    )

    if (state.artistSong && index !== undefined) {
      state.artistSong[index].is_liked = object.is_add_to_liked
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
    const album: Album = item.song?.albums?.at(0) as Album
    const songUrl = await Songs.playSong(item.song._id)

    playerStore.setMusicList(state.artistSong || [])

    playerStore.setMusic(
      {
        _id: item.song?._id,
        title: item.song?.name,
        artist: item.song?.artists?.at(0),
        album: album?.name,
        duration: item.song?.duration,
        url: songUrl.data?.url,
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

const viewArtist = (artist: Artist) => {
  router.push(`/artist/${artist?._id}`)
}

const goToAlbum = (album: Album) => {
  router.push(`/album/${album?._id}`)
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

const closeModal = (bool: boolean) => {
  dialog.value = bool
}

const dontPlayThis = (song: Song) => {
  console.log(song)
}

onMounted(async () => {
  await getArtistCode()

  if (data.artist) {
    playerStore.setArtistName(data.artist)
  }
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

    <q-list class="scroll">
      <q-infinite-scroll
        v-model="state.loading"
        :offset="250"
        @load="getArtistSongs"
      >
        <g-music-song-list
          :list="state.artistSong"
          :artist="playerStore.artist"
          :artist-id="playerStore.artist?._id"
          @toggleplay="onAudioToggle"
          @download="downloadSong"
          @go-to-album="goToAlbum"
          @set-liked="setLiked"
          @view-artist="viewArtist"
          @add-playlist="addPlayList"
          @dont-play-this="dontPlayThis"
        />

        <template v-if="state.loading && !state.finished" #loading>
          <div class="row justify-center q-my-md">
            <g-loader />
          </div>
        </template>
      </q-infinite-scroll>
    </q-list>

    <g-music-playlist-modal
      v-if="dialog"
      :dialog="dialog"
      :song="data.songPlaylist"
      @add-playlist-song="addPlaylistSong"
      @close-modal-create="dialog = false"
    />
  </div>
</template>
