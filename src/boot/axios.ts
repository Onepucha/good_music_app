import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { useLoadingStore } from '@/stores'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  headers: {
    'Content-type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const loadingStore = useLoadingStore()
  loadingStore.setLoading(true)
  return config
})

api.interceptors.response.use(
  (res) => {
    const loadingStore = useLoadingStore()
    loadingStore.setLoading(false)
    return Promise.resolve(res)
  },
  (err) => {
    const loadingStore = useLoadingStore()
    loadingStore.setLoading(false)
    return Promise.reject(err)
  }
)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
