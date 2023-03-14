import { defineStore } from 'pinia'

import { fetchWrapper } from 'src/helpers'
import { ref } from 'vue'
import { Song } from 'src/types/artist'

const baseUrl = `${import.meta.env.VITE_API_URL}/albums`

export const useAlbumsStore = defineStore('albums', () => {
  // initial state
  const albums = ref<Array<Song> | undefined>([])

  // actions
  const getAlbums = async () => {
    try {
      albums.value = await fetchWrapper.get(baseUrl)
      return albums.value
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return { albums, getAlbums }
})
