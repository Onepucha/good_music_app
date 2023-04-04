<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { Artist, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import { useRoute, useRouter } from 'vue-router'
import { useArtistsStore, usePlayerStore } from '@/stores'
import { downloadSong } from '@/utils/utils'

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
const router = useRouter()
const playerStore = usePlayerStore()

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

    if (data.artistSong && index !== undefined) {
      data.artistSong[index].is_liked = object.is_add_to_liked
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
  playerStore.setMusicList(data.artistSong || [])

  playerStore.setMusic(
    {
      _id: item.song?._id,
      title: item.song?.name,
      artist: data?.artist?.name,
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

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const goToAlbum = (url: string) => {
  router.push(`/album/${url}`)
}

const addPlayList = (song: Song) => {
  console.log(song)
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
        ref="scrollTargetRef"
        :offset="250"
        @load="getArtistSongs"
      >
        <g-music-song-list
          v-if="data.artistSong.length"
          :list="data.artistSong"
          :artist="playerStore.artist"
          :artist-id="playerStore.artist._id"
          @toggleplay="onAudioToggle"
          @download="downloadSong"
          @go-to-album="goToAlbum"
          @set-liked="setLiked"
          @view-artist="viewArtist"
          @add-playlist="addPlayList"
          @dont-play-this="dontPlayThis"
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
