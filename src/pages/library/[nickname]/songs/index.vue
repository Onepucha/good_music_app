<script lang="ts" setup>
import { defineComponent, nextTick, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicPlaylistModal from '@/components/gMusicPlaylistModal/gMusicPlaylistModal.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import Songs from '@/services/songs'
import PlaylistsApi from '@/services/playlists'
import { Playlists, Song } from '@/types/artist'

import { useTranslation } from '@/composables/lang'
import { useRoute, useRouter } from 'vue-router'
import { downloadSong } from '@/utils/utils'
import { useAlertStore, useAuthStore, usePlayerStore } from '@/stores'
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
    gMusicSongList,
    gMusicFiltered,
    gMusicPlaylistModal,
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

useMeta(() => {
  return {
    title: t('pages.library.songs.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.library.songs.contentHead'),
      },
    },
  }
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

const onRecently = async (direction: string) => {
  const response: any = await Songs.getLiked({
    count: data.albumCount,
    page: 1,
    direction: direction,
  })

  data.songs = response.data.songs
}

const shufflePlay = async () => {
  // Создаем копию массива песен
  const shuffledSongs = data.songs.slice()

  // Перемешиваем массив песен
  for (let i = shuffledSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]]
  }

  const songId = shuffledSongs?.at(0)?._id

  if (songId) {
    playerStore.setLoading(true)
    const songUrl = await Songs.playSong(songId)

    playerStore.setMusicList(shuffledSongs)

    playerStore.setMusic(
      {
        _id: shuffledSongs?.at(0)?._id,
        title: shuffledSongs.at(0)?.name,
        artist: shuffledSongs?.at(0)?.artists?.at(0),
        album: shuffledSongs?.at(0)?.album_code?.split('-')[1].trim(),
        url: songUrl.data?.url,
        src: songUrl.data?.url,
        pic: shuffledSongs.at(0)?.cover_src,
        is_liked: shuffledSongs.at(0)?.is_liked,
        genres: shuffledSongs.at(0)?.genres,
        duration: shuffledSongs.at(0)?.duration,
        release_date: shuffledSongs.at(0)?.release_date,
      } as Song,
      0
    )
    playerStore.setPlaying(true)

    nextTick(() => {
      playerStore.player.play()
    })
  }
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

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
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

    playerStore.setMusicList(data.songs)

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
        duration: item.song?.duration,
        release_date: item.song?.release_date,
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

const setLiked = async (
  isSingle: boolean,
  object: {
    ids: string[]
    is_add_to_liked: boolean
  }
) => {
  try {
    await Songs.setLiked(object.ids, object.is_add_to_liked)

    const index = data.songs?.findIndex((song) => song._id === object.ids.at(0))

    if (data.songs && object.is_add_to_liked && index !== undefined) {
      data.songs[index].is_liked = object.is_add_to_liked
    } else {
      const index = data.songs?.findIndex(
        (song) => song._id === object.ids.at(0)
      )
      if (index !== undefined) {
        data.songs.splice(index, 1)
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

const goToAlbum = (url: string) => {
  router.push(`/album/${url}`)
}

const openSearch = () => {
  authStore.searchModal = true
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
      <DynamicIcon :size="28" name="search" @click.prevent="openSearch" />
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
        @set-liked="setLiked"
      />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
  <g-music-playlist-modal
    v-if="dialog"
    :dialog="dialog"
    :song="data.songPlaylist"
    @add-playlist-song="addPlaylistSong"
    @close-modal-create="dialog = false"
  />
</template>
