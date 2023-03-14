import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  // initial state
  const isLoading = ref<boolean>(false)

  // actions
  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  return { setLoading }
})
