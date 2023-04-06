import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '@/stores'
import { deleteCookie, getCookie } from '@/utils/utils'
import { api } from '@/boot/axios'
import { User } from '@/types/users'

const user = ref<User | null>(null)
const authStore = useAuthStore()

const fetchUser = async () => {
  try {
    if (getCookie('test-session')) {
      const response = await api.get('user/info')
      user.value = response.data.user
      authStore.user = response.data.user
    } else {
      await deleteCookie('test-session')
    }
  } catch (error: unknown) {
    console.error(error)
  }
}

export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  await fetchUser()
  if (!user.value && to.meta.requiresAuth) {
    next({ path: '/login' })
  } else {
    next()
  }
}
