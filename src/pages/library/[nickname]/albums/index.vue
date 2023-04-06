<script lang="ts" setup>
import { defineComponent, nextTick, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import gMusicAlbum from '@/components/gMusicAlbum/gMusicAlbum.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import Albums from '@/services/albums'
import { Album, AlbumArtist, Song } from '@/types/artist'

import { useTranslation } from '@/composables/lang'
import { useRoute, useRouter } from 'vue-router'
import { downloadSong } from '@/utils/utils'
import { usePlayerStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    gBack,
    gMusicAlbum,
    gMusicFiltered,
    gLoader,
    DynamicIcon,
  },
})

interface Data {
  albums: Array<Album>
  page: number
  albumCount: number
  isLoading: boolean
}

const data: Data = reactive({
  albums: [],
  page: 0,
  albumCount: 24,
  isLoading: false,
})

const scrollTargetRef = ref<any>(document.createElement('div'))

const getLikedAlbums = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await Albums.getLiked({
      count: data.albumCount,
      page: data.page,
    })

    if (response.data.albums.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()
    data.albums = data.albums.concat(response.data.albums)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
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

const removeLibrary = (album: Album) => {
  console.log(album)
}
</script>

<template>
  <div class="q-page">
    <div class="q-page__header">
      <g-back
        :label="t('pages.albums.buttonBackAlbums')"
        icon="back"
        @click.prevent="$router.go(-1)"
      />
      <DynamicIcon :size="28" name="search" />
    </div>

    <g-music-filtered
      :label="t('pages.albums.gMusicFiltered.label')"
      :recently="t('pages.albums.gMusicFiltered.recently')"
      @recently="onRecently"
    />

    <q-infinite-scroll
      ref="scrollTargetRef"
      :offset="250"
      @load="getLikedAlbums"
    >
      <g-music-album
        v-for="(album, index) in data.albums"
        :key="index"
        :album="album"
        @shuffle-play="shufflePlay"
        @add-playlist="addPlayList"
        @view-artist="viewArtist"
        @remove-library="removeLibrary"
        @download="downloadSong"
      />

      <template #loading>
        <div class="row justify-center q-my-md">
          <g-loader />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>
