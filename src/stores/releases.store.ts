import { defineStore } from 'pinia'

import { fetchWrapper } from '@/helpers'
import { ref } from 'vue'

const baseUrl = `${import.meta.env.VITE_API_URL}/releases`

export const useReleasesStore = defineStore('releases', () => {
  // initial state
  const releases = ref<Array<string> | []>([])

  // actions
  const getReleases = async () => {
    try {
      releases.value = await fetchWrapper.get(baseUrl)

      return releases.value
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return { releases, getReleases }
})
