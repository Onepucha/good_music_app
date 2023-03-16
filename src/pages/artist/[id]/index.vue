<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Artist, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gMusicGenericArtist from '@/components/gMusicGenericArtist/gMusicGenericArtist.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, useArtistsStore, usePlayerStore } from '@/stores'
import Songs from '@/services/songs'
import { AxiosResponse } from 'axios'

const { t } = useTranslation()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    gBack,
    gMusicGenericArtist,
    gMusicSongList,
  },
})

const route = useRoute()

const isLoading = ref<boolean>(true)

interface Data {
  artist: Artist
  artistSong: Array<Song>
  isLoading: boolean
}

const data: Data = reactive({
  artist: {} as Artist,
  artistSong: [],
  isLoading: false,
})

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
    const response: AxiosResponse = await Songs.getAll({ count: 3, id: id })

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

    data.isLoading = false
  } catch (error: unknown) {
    console.error(error)
    data.isLoading = false
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
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
  playerStore.setMusicList(data.artistSong || [])

  playerStore.setMusic(
    {
      _id: item.song?._id,
      title: item.song?.name,
      artist: data?.artist?.name,
      src: item.song?.url,
      pic: '',
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
      />

      <g-music-song-list
        v-if="data.artistSong.length"
        :list="data.artistSong"
        :artist="data.artist?.name"
        :artist-id="data.artist?._id"
        :sub-title="t('pages.artists.gMusicSongList.subTitle')"
        :title="t('pages.artists.gMusicSongList.title')"
        @toggleplay="onAudioToggle"
      />
    </template>
  </div>
</template>
