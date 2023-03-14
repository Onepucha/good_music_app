<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'
import { Artist, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import { useTranslation } from '@/composables/lang'
import { AxiosResponse } from 'axios'
import Songs from '@/services/songs'
import { useRoute } from 'vue-router'
import { useArtistsStore } from '@/stores'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gLoader,
    gMusicSongList,
  },
})

const route = useRoute()

const isLoading = ref<boolean>(true)

interface Data {
  artist: Artist | undefined
  artistSong: Array<Song>
}

const data: Data = reactive({
  artist: undefined,
  artistSong: [],
})

const getArtistSongs = async (index: number, done: () => void) => {
  try {
    isLoading.value = true
    let id: string | string[] = route.params.id
    const response: AxiosResponse = await Songs.getAll({ id: id })

    data.artistSong = data.artistSong.concat(response.data.songs)
    isLoading.value = false
    done()
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

getArtistCode()
</script>

<template>
  <div class="q-page">
    <div class="q-page__header">
      <g-back icon="back" @click.prevent="$router.go(-1)" />
      <i class="g-icon g-icon-dropdown-menu">
        <span></span>
      </i>
    </div>

    <q-infinite-scroll :offset="250" @load="getArtistSongs">
      <g-music-song-list
        v-if="data.artistSong.length"
        :list="data.artistSong"
        :artist="data.artist?.name"
        :artist-id="data.artist?._id"
      />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<route lang="yaml">
meta:
layout: default
</route>
