<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'
import { Artist, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import { useRoute } from 'vue-router'
import { useArtistsStore } from '@/stores'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gLoader,
    gMusicSongList,
    gMusicSongListNotFound,
  },
})

const route = useRoute()

const isLoading = ref<boolean>(true)

interface Data {
  artist: Artist | undefined
  artistSong: Array<Song>
  page: number
}

const data: Data = reactive({
  artist: undefined,
  artistSong: [],
  page: 0,
})

const scrollTargetRef = ref<any>(document.createElement('div'))

const getArtistSongs = async (index: number, done: () => void) => {
  try {
    data.page++
    let id: string | string[] = route.params.id
    const response: any = await Songs.getAll({
      id: id,
      page: data.page,
    })

    if (response.data.songs.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()
    data.artistSong = data.artistSong.concat(response.data.songs)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
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

    <q-list class="scroll">
      <q-infinite-scroll
        ref="scrollTargetRef"
        :offset="250"
        @load="getArtistSongs"
      >
        <g-music-song-list
          v-if="data.artistSong.length"
          :list="data.artistSong"
          :artist="data.artist?.name"
          :artist-id="data.artist?._id"
        />
        <g-music-song-list-not-found v-else />

        <template #loading>
          <div class="row justify-center q-my-md">
            <g-loader />
          </div>
        </template>
      </q-infinite-scroll>
    </q-list>
  </div>
</template>
