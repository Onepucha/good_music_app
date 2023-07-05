<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Playlists, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gMusicPlaylistsDetails from '@/components/gMusicPlaylists/gMusicPlaylistsDetails.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import PlaylistsApi from '@/services/playlists'
import { downloadSong } from '@/utils/utils'
import {
  useAlertStore,
  useAuthStore,
  useLoadingStore,
  usePlayerStore,
} from '@/stores'
import { useMeta } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gMusicPlaylistsDetails,
    gMusicSongList,
    gMusicPlaylistModal,
  },
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const loadingStore = useLoadingStore()
const alertStore = useAlertStore()

const isLoading = ref<boolean>(true)
const dialog = ref<boolean>(false)
const dialogAddModal = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')

interface Data {
  playlist?: Playlists | undefined
  playlistsSong: Array<Song>
  songPlaylist: Song | undefined
}

const data: Data = reactive({
  playlist: undefined,
  playlistsSong: [],
  songPlaylist: undefined,
})

useMeta(() => {
  return {
    title: t('pages.playlists.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.playlists.contentHead'),
      },
    },
  }
})

const getInfoPlaylist = async () => {
  try {
    let id: string | string[] = route.params.id
    const response: any = await PlaylistsApi.getInfo({ id })

    data.playlist = response.data.playlist
  } catch (error: unknown) {
    console.error(error)
  }
}

const getPlaylistSongs = async () => {
  try {
    let id: string | string[] = route.params.id
    const response: any = await Songs.getPlaylistSongs(id)

    data.playlistsSong = response.data.songs
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
    await PlaylistsApi.setLiked(object.ids, object.is_add_to_liked)

    const index = data.playlistsSong?.findIndex(
      (song) => song._id === object.ids.at(0)
    )

    if (isSingle) {
      if (data.playlistsSong && index !== undefined) {
        data.playlistsSong[0].is_liked = object.is_add_to_liked
      }
    } else {
      if (data.playlist) {
        data.playlist.is_liked = object.is_add_to_liked
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
    const songUrl = await Songs.playSong(item.song._id)

    playerStore.setMusicList(data.playlistsSong || [])

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

const removePlaylist = (playlist: Playlists) => {
  dialog.value = true
}

const confirmRemovePlaylist = async (playlist: Playlists) => {
  try {
    if (data.playlist?._id) {
      await PlaylistsApi.removePlaylist(data.playlist._id)
    }

    await router.replace(`/library/${authStore.user?.nickname}/playlists`)
  } catch (error: unknown) {
    console.error(error)
  }
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const goToAlbum = (url: string) => {
  router.push(`/album/${url}`)
}

const dontPlayThis = (song: Song) => {
  console.log(song)
}

const addPlayList = (song: Song) => {
  dialogAddModal.value = true
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
    dialogAddModal.value = false
    alertStore.success(t('success'))
  } catch (error: unknown) {
    dialogAddModal.value = false
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

onMounted(async () => {
  loadingStore.setLoading()
  await getInfoPlaylist()
  await getPlaylistSongs()
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

    <g-music-playlists-details
      :playlist="data.playlist"
      :song="data.playlistsSong.at(0)"
      @set-liked="setLiked"
      @download="downloadSong"
      @add-playlist="addPlayList"
      @dont-play-this="dontPlayThis"
      @view-artist="viewArtist"
      @go-to-album="goToAlbum"
      @toggleplay="onAudioToggle"
    />

    <g-music-song-list
      :list="data.playlistsSong"
      :sub-title="t('pages.playlists.gMusicSongListTrack.subTitle')"
      :title="t('pages.playlists.gMusicSongListTrack.title')"
      :artist-id="data.playlistsSong?.at(0)?.artists?.at(0)?._id"
      @toggleplay="onAudioToggle"
      @download="downloadSong"
      @go-to-album="goToAlbum"
      @set-liked="setLiked"
      @view-artist="viewArtist"
      @dont-play-this="dontPlayThis"
      @add-playlist="addPlayList"
      @remove-playlist="removePlaylist"
    />

    <g-music-playlist-modal
      v-if="dialogAddModal"
      :dialog="dialogAddModal"
      :song="data.songPlaylist"
      @add-playlist-song="addPlaylistSong"
      @close-modal-create="dialogAddModal = false"
    />

    <q-dialog
      v-if="dialog"
      ref="qDialogPopup"
      v-model="dialog"
      :position="position"
      class="g-popup-profile"
    >
      <q-card>
        <q-card-section class="g-popup-profile__body text-center">
          <h4>{{ t('pages.library.playlists.popup.title') }}</h4>
          <h5>
            {{ t('pages.library.playlists.popup.description') }}
          </h5>
          <div class="g-popup-profile__action">
            <q-btn
              v-close-popup
              :label="t('pages.library.playlists.popup.buttonCancel')"
              class="g-popup-profile__btn q-btn--light-primary q-btn-large"
              rounded
              text-color="''"
              unelevated
            />

            <q-btn
              :label="t('pages.library.playlists.popup.buttonConfirm')"
              :loading="isLoading"
              class="g-popup-profile__btn q-btn-large"
              rounded
              text-color="''"
              unelevated
              @click.prevent="confirmRemovePlaylist"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
