<script lang="ts" setup>
import { defineComponent, nextTick, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import Songs from '@/services/songs'
import { AlbumArtist, Song } from '@/types/artist'

import { useTranslation } from '@/composables/lang'
import { useRoute, useRouter } from 'vue-router'
import { downloadSong } from '@/utils/utils'
import { useLoadingStore, usePlayerStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()
const playerStore = usePlayerStore()
const loadingStore = useLoadingStore()

defineComponent({
  components: {
    gBack,
    gMusicSongList,
    gMusicFiltered,
    gLoader,
    DynamicIcon,
  },
})

interface Data {
  songs: Array<Song>
  page: number
  albumCount: number
  isLoading: boolean
}

const data: Data = reactive({
  songs: [],
  page: 0,
  albumCount: 24,
  isLoading: false,
})

const scrollTargetRef = ref<any>(document.createElement('div'))

const getLikedSongs = async (index: number, done: () => void) => {
  loadingStore.setLoading(false)
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
    loadingStore.setLoading(true)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
    loadingStore.setLoading(true)
  }
}

const onRecently = () => {
  console.log('Recently')
}

const shufflePlay = (songs: Array<Song>, artist: AlbumArtist) => {
  // Создаем копию массива песен
  const shuffledSongs = songs.slice()

  // Перемешиваем массив песен
  for (let i = shuffledSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]]
  }

  // Обновляем массив песен
  songs = shuffledSongs

  playerStore.setMusicList(songs)

  playerStore.setMusic(
    {
      _id: songs?.at(0)?._id,
      title: songs.at(0)?.name,
      artist: artist?.name,
      src: songs.at(0)?.url,
      pic: '',
      genres: songs.at(0)?.genres,
    } as Song,
    0
  )
  playerStore.setPlaying(true)

  nextTick(() => {
    playerStore.player.play()
  })
}

const addPlayList = (song: Song) => {
  console.log(song)
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
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
  playerStore.setMusicList(data.songs)

  playerStore.setMusic(
    {
      _id: item.song?._id,
      title: item.song?.name,
      artist: item.song?.artists?.at(0)?.name,
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

const onShuffle = () => {
  console.log(123)
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
      <DynamicIcon :size="28" name="search" />
    </div>

    <g-music-filtered
      :label="t('pages.library.songs.label')"
      :recently="t('pages.library.songs.recently')"
      :song="data.songs?.at(0)"
      action
      @recently="onRecently"
      @toggleplay="onAudioToggle"
      @shuffle="onShuffle"
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
      />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>
