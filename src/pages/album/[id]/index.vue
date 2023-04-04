<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Album, Artist, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gAlbumProfiles from '@/components/gAlbumProfiles/gAlbumProfiles.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, useAuthStore, usePlayerStore } from '@/stores'
import { downloadSong } from '@/utils/utils'
import Songs from '@/services/songs'
import Albums from '@/services/albums'

const { t } = useTranslation()
const authStore = useAuthStore()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    gBack,
    gAlbumProfiles,
    gMusicSongList,
    gMusicSongListNotFound,
  },
})

const route = useRoute()
const router = useRouter()

const isLoading = ref<boolean>(true)

interface Data {
  artist: Artist
  album: Album
  albumSong: Array<Song>
  isLoading: boolean
}

const data: Data = reactive({
  artist: null,
  album: {},
  albumSong: [],
  isLoading: false,
})

const getAlbumCode = async () => {
  try {
    let id: string | string[] = route.params.id
    const response: any = await Albums.getInfo({ id })
    data.album = response.data.album
    data.albumSong = response.data.album.songs
  } catch (error: unknown) {
    isLoading.value = false
  }
}

const addFollow = async (object: { follow: boolean; album: Album }) => {
  const alertStore = useAlertStore()

  try {
    data.isLoading = true

    await Albums.setFollow([object.album._id], object.follow)

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

    const index = data.albumSong?.findIndex(
      (song) => song._id === object.ids.at(0)
    )

    if (data.albumSong && index !== undefined) {
      data.albumSong[index].is_liked = object.is_add_to_liked
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

const onAudioPlay = (item: { song: Song; index: number }) => {
  playerStore.setMusicList(data.albumSong || [])

  playerStore.setMusic(
    {
      _id: item.song?._id,
      title: item.song?.name,
      artist: data?.album?.name,
      src: item.song?.url,
      pic: '',
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

const addPlayList = (song: Song) => {
  console.log(song)
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

onMounted(async () => {
  await getAlbumCode()

  if (data.artist) {
    playerStore.setArtistName(data.artist)
  }
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
      <g-album-profiles
        :album="data?.album"
        :songs="data.albumSong"
        :song="data.albumSong.at(0)"
        @add-follow="addFollow"
        @toggleplay="onAudioToggle"
        @set-liked="setLiked"
        @download="downloadSong"
        @view-artist="viewArtist"
        @go-to-album="goToAlbum"
        @add-playlist="addPlayList"
        @dont-play-this="dontPlayThis"
      />

      <g-music-song-list
        v-if="data.albumSong.length"
        :list="data.albumSong"
        :artist="data.album?.artists?.at(0)"
        :artist-id="data.album?._id"
        :sub-title="t('pages.artists.gMusicSongList.subTitle')"
        :title="t('pages.artists.gMusicSongList.title')"
        @toggleplay="onAudioToggle"
        @set-liked="setLiked"
        @view-artist="viewArtist"
        @add-playlist="addPlayList"
        @download="downloadSong"
        @dont-play-this="dontPlayThis"
      />
      <g-music-song-list-not-found v-else />
    </template>
  </div>
</template>