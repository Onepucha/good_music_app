import { defineStore } from 'pinia'

import { fetchWrapper } from '@/helpers'
import { api } from '@/boot/axios'
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
      artist.value = await api.get(`/artist/info/${id}`)
      return artist.value
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const getAllArtists = async (query: any) => {
    try {
      artists.value = await api.get('artist/all', {
        params: query,
      })
      return artists.value
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const saveFollowArtist = async (is_follow: boolean, ids: string[]) => {
    await api.post('/artist/manage', {
      is_follow,
      ids,
    })

    const authStore = useAuthStore()

    await authStore.userInfo()
  }

  return { artists, getArtists, getArtistCode, getAllArtists, saveFollowArtist }
})
