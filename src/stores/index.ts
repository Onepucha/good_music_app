import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'

export * from './alert.store'
export * from './auth.store'
export * from './users.store'
export * from './artists.store'
export * from './releases.store'
export * from './popularArtists.store'
export * from './charts.store'
export * from './loading.store'
export * from './player.store'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})

