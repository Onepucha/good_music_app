import { defineStore } from 'pinia'
import { LoginInput, SaveProfileInput, User } from 'src/types/users'
import { deleteCookie } from '@/utils/utils'
import { api } from '@/boot/axios'
import { useAlertStore } from '@/stores'
import { computed, ref } from 'vue'
import { AxiosResponse } from 'axios'

export const useAuthStore = defineStore('auth', () => {
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

  const setProfile = async (option: {
    fullname?: string
    nickname?: string
    birth_date?: Date
    gender?: string
    avatar?: string
    language_descriptor?: string
    dark_theme?: boolean
  }) => {
    const response: AxiosResponse = await api.post<SaveProfileInput>(
      '/user/edit',
      option
    )

    user.value = {
      ...user.value,
      ...response.data.user,
    }
  }

  const findSongLiked = (id: string) => {
    return user.value?.songs ? user.value?.songs?.includes(id) : false
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
  }

  // getters
  const fullname = computed<string>(
    () => user.value?.fullname || user.value?.email || ''
  )

  return {
    user,
    login,
    userInfo,
    setProfile,
    setLocale,
    logout,
    findSongLiked,
    fullname,
  }
})
