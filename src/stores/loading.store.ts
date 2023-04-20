import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import MainLoader from '@/components/MainLoader.vue'

export const useLoadingStore = defineStore('loading', () => {
  // initial state
  const isLoading = ref<boolean>(false)
  const $q = useQuasar()

  // actions
  const setLoading = () => {
    $q.loading.show({
      spinner: MainLoader,
    })
  }

  const hideLoading = () => {
    $q.loading.hide()
    isLoading.value = false
  }

  return { isLoading, setLoading, hideLoading }
})
