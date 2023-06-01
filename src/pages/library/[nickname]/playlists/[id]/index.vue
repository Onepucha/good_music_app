<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Playlists, Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gPlaylistHeader from '@/components/gPlaylistHeader/gPlaylistHeader.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import { downloadSong } from '@/utils/utils'
import {
  useAlertStore,
  useAuthStore,
  useLoadingStore,
  usePlayerStore,
} from '@/stores'
import PlaylistsApi from '@/services/playlists'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gPlaylistHeader,
    gMusicSongList,
    gMusicPlaylistModal,
  },
})

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const alertStore = useAlertStore()

const isLoading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const dialogAddModal = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')

interface Data {
  playlist?: Playlists | undefined
  song: Song | undefined
  playlistsSong: Array<Song>
  songPlaylist: Song | undefined
}

const data: Data = reactive({
  playlist: undefined,
  song: undefined,
  playlistsSong: [],
  songPlaylist: undefined,
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

    const index = data.playlistsSong?.findIndex(
      (song) => song._id === object.ids.at(0)
    )

    if (data.playlistsSong && index !== undefined) {
      data.playlistsSong[index].is_liked = object.is_add_to_liked
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

const shufflePlay = () => {
  // Создаем копию массива песен
  const shuffledSongs = data.playlistsSong.slice()

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
      artist: shuffledSongs?.at(0)?.artists?.at(0),
      src: shuffledSongs.at(0)?.url,
      pic: shuffledSongs.at(0)?.cover_src,
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

const removePlaylist = (playlist: Playlists) => {
  dialog.value = true
}

const confirmRemovePlaylist = async (playlist: Playlists) => {
  try {
    isLoading.value = true

    if (data.playlist?._id) {
      await PlaylistsApi.removePlaylist(data.playlist._id)
    }

    await router.replace(`/library/${authStore.user?.nickname}/playlists`)
    isLoading.value = false
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
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
  } catch (error: unknown) {
    dialogAddModal.value = false
    console.error(error)
  }
}

const openSearch = () => {
  authStore.searchModal = true
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
      <DynamicIcon name="search" :size="28" @click.prevent="openSearch" />
    </div>

    <g-playlist-header
      :playlist="data.playlist"
      :song="data.playlistsSong.at(0)"
      @set-liked="setLiked"
      @download="downloadSong"
      @toggleplay="onAudioToggle"
      @shuffle="shufflePlay"
      @remove-playlist="removePlaylist"
    />

    <g-music-song-list
      :list="data.playlistsSong"
      @toggleplay="onAudioToggle"
      @download="downloadSong"
      @go-to-album="goToAlbum"
      @set-liked="setLiked"
      @view-artist="viewArtist"
      @add-playlist="addPlayList"
      @dont-play-this="dontPlayThis"
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
