import { defineStore } from 'pinia'
import { LoginInput, SaveProfileInput, User } from 'src/types/users'
import { deleteCookie } from '@/utils/utils'
import { api } from '@/boot/axios'
import { useAlertStore } from '@/stores'
import { computed, ref } from 'vue'
import { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  // initial state
  const user = ref<User | undefined>(undefined)

  // actions
  const login = async (email: string, password: string) => {
    await api.post<LoginInput>('user/login', {
      email,
      password,
    })

    const response: any = await api.get('user/info')

    user.value = response.data.user
  }

  const userInfo = async () => {
    try {
      const response: any = await api.get('user/info')

      user.value = response.data.user
    } catch (error: unknown) {
      console.error(error)
      const alertStore = useAlertStore()

      if (error instanceof Error) {
        alertStore.error(error.message)
      }
    }
  }

  const setProfile = async (
    avatar: string,
    fullname: string,
    nickname: string,
    birth_date: Date,
    gender: string
  ) => {
    const response: AxiosResponse = await api.post<SaveProfileInput>(
      '/user/edit',
      {
        avatar,
        fullname,
        nickname,
        birth_date,
        gender,
      }
    )

    user.value = {
      ...user.value,
      ...response.data.user,
    }
  }

  const setLocale = (locale: string) => {
    if (user.value !== undefined) {
      user.value.language_descriptor = locale
    }
  }

  const logout = async () => {
    user.value = undefined
    await api.get('/user/logout')
    deleteCookie('test-session')
    await router.push('/login')
  }

  // getters
  const fullname = computed<string>(
    () => user.value?.fullname || user.value?.email || ''
  )

  return { user, login, userInfo, setProfile, setLocale, logout, fullname }
})
