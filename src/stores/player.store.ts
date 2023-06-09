import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Artist, Song } from 'src/types/artist'

export const usePlayerStore = defineStore('player', () => {
  // initial state
  const player = ref<any>(null)
  const playing = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const artist = ref<Artist | undefined>(undefined)
  const music = ref<null | Song>(null)
  const musicIndex = ref<number | null>(null)
  const list = ref<Array<Song>>([])

  // actions
  const setArtistName = (artistObj: Artist) => {
    artist.value = artistObj
  }

  const setPlaying = (isPlaying: boolean) => {
    playing.value = isPlaying
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const setMusic = (currentMusic: Song, index: number) => {
    music.value = currentMusic
    musicIndex.value = index
    player.value.data.internalMusic = currentMusic
    player.value.data.songIndex = index
  }

  const setMusicList = (currentList: Array<Song>) => {
    list.value = currentList
    player.value.data.internalList = currentList
  }

  const artistId = computed<string>(() => {
    return artist.value?._id || ''
  })

  const musicId = computed<string>(() => {
    return music.value?._id || ''
  })

  const getMusicIndex = computed<number | null>(() => {
    return musicIndex.value || null
  })

  return {
    artist,
    player,
    playing,
    loading,
    music,
    musicIndex,
    list,
    musicId,
    artistId,
    setArtistName,
    setPlaying,
    setLoading,
    setMusic,
    setMusicList,
    getMusicIndex,
  }
})
