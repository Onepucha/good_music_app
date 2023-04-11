<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Artist, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gMusicPlaylistsDetails from '@/components/gMusicPlaylists/gMusicPlaylistsDetails.vue'
import GMusicPlaylistsDetails from '@/components/gMusicPlaylists/gMusicPlaylistsDetails.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import { useTranslation } from '@/composables/lang'
import Songs from '@/services/songs'
import { downloadSong } from '@/utils/utils'
import { useArtistsStore, usePlayerStore } from '@/stores'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gMusicPlaylistsDetails,
    gMusicSongList,
  },
})

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

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

const getSong = async () => {
  try {
    let id: string | string[] = route.params.code
    const response: any = await Songs.get(id)

    data.song = response.data.song
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
  }
}

const getArtistSongs = async () => {
  try {
    let id: string | string[] = route.params.id
    const response: any = await Songs.getAll({ count: 3, id: id })

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

    data.artist = response?.data?.artist
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

    if (isSingle) {
      if (data.song) {
        data.song.is_liked = object.is_add_to_liked
      }
    } else {
      const index = data.artistSong?.findIndex(
        (song) => song._id === object.ids.at(0)
      )

      if (data.artistSong && index !== undefined) {
        data.artistSong[index].is_liked = object.is_add_to_liked
      }
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
      is_liked: item.song?.is_liked,
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

const dontPlayThis = (song: Song) => {
  console.log(song)
}

onMounted(async () => {
  await getArtistCode()
  await getSong()
  await getArtistSongs()

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
      <g-music-playlists-details
        :song="data.song"
        :artist="playerStore.artist"
        @set-liked="setLiked"
        @download="downloadSong"
        @dont-play-this="dontPlayThis"
        @view-artist="viewArtist"
        @go-to-album="goToAlbum"
        @toggleplay="onAudioToggle"
      />

      <g-music-song-list
        :list="data.artistSong"
        :artist="playerStore.artist"
        :artist-id="playerStore.artist?._id"
        :sub-title="t('pages.playlists.gMusicSongListTrack.subTitle')"
        :title="t('pages.playlists.gMusicSongListTrack.title')"
        @toggleplay="onAudioToggle"
        @download="downloadSong"
        @go-to-album="goToAlbum"
        @set-liked="setLiked"
        @view-artist="viewArtist"
        @dont-play-this="dontPlayThis"
      />
    </template>
  </div>
</template>
