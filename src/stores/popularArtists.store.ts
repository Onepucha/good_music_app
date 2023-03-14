import { defineStore } from 'pinia'

import { fetchWrapper } from 'src/helpers'
import { ref } from 'vue'

const baseUrl = `${import.meta.env.VITE_API_URL}/popularArtist`

export const usePopularArtistsStore = defineStore('popularArtists', () => {
  // initial state
  const artists = ref<Array<string> | []>([])

  // actions
  const getPopularArtists = async () => {
    try {
      artists.value = await fetchWrapper.get(baseUrl)
      return artists.value
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return { artists, getPopularArtists }
})
