<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Artist, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gSongInfo from '@/components/gSongInfo/gSongInfo.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import { AxiosResponse } from 'axios'
import { useArtistsStore } from '@/stores'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gSongInfo,
    gMusicSongList,
  },
})

const route = useRoute()

const isLoading = ref<boolean>(true)

interface Data {
  song: Song | undefined
  artist: Artist | undefined
  artistSong: Array<Song> | undefined
}

const data: Data = reactive({
  song: undefined,
  artist: undefined,
  artistSong: [],
})

const artistSongLength = computed<boolean>(() => {
  return data?.artistSong ? data.artistSong?.length > 0 : false
})

const getSong = async () => {
  try {
    let id: string | string[] = route.params.code
    const response: AxiosResponse = await Songs.get(id)

    data.song = response.data.song
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

onMounted(async () => {
  await getArtistCode()
  await getSong()
  await getArtistSongs()

  isLoading.value = false
})

// watch(() => route.params.code, getSong)
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
      <g-song-info :song="data.song" :artist="data.artist?.name" />

      <g-music-song-list
        v-if="artistSongLength"
        :list="data.artistSong"
        :artist="data.artist?.name"
        :artist-id="data.artist?._id"
        :sub-title="t('pages.artists.gMusicSongListTrack.subTitle')"
        :title="t('pages.artists.gMusicSongListTrack.title')"
      />
    </template>
  </div>
</template>

<route lang="yaml">
meta:
layout: default
</route>
