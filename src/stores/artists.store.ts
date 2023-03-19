import { defineStore } from 'pinia'

import { fetchWrapper } from '@/helpers'
import Artists from '@/services/artists'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { Artist } from '@/types/artist'

const baseUrl = `${import.meta.env.VITE_API_URL}/artist`

export const useArtistsStore = defineStore('artists', () => {
  // initial state
  const artists = ref<Array<Artist> | []>([])
  const artist = ref<Artist>()

  // actions
  const getArtists = async () => {
    try {
      artists.value = await fetchWrapper.get(baseUrl)
      return artists.value
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const getArtistCode = async (id: string | string[]) => {
    try {
      return (artist.value = await Artists.getInfo(id))
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const getAllArtists = async (query: any) => {
    try {
      return (artists.value = await Artists.getAll(query))
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const saveFollowArtist = async (is_follow: boolean, ids: string[]) => {
    await Artists.setFollow(ids, is_follow)
    const authStore = useAuthStore()
    await authStore.userInfo()
  }

  return { artists, getArtists, getArtistCode, getAllArtists, saveFollowArtist }
})
