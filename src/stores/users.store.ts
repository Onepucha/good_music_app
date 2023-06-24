import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  changePassword,
  emailVerify,
  sendCode,
  User,
  UserResponse,
} from 'src/types/users'

import { api } from '@/boot/axios'
import { useRouter } from 'vue-router'

export const useUsersStore = defineStore('users', () => {
  const router = useRouter()

  // initial state
  const user = ref<User | boolean>(false)
  const menuTheme = ref<boolean>(false)
  const systemInformation = ref<any>(undefined)

  // actions
  const setMenuTheme = async (theme: boolean) => {
    menuTheme.value = theme
  }

  const register = async (user: object) => {
    await api.post<UserResponse>('user/signup', user)
  }

  const sendCode = async (email: object) => {
    await api.post<sendCode>('user/send-link-restore-password', email)
    await router.push('/login')
  }

  const sendVerifyEmail = async (email: string) => {
    await api.post<sendCode>('user/send-link-verify-email', { email: email })
  }

  const changePassword = async (password: string, token: string) => {
    await api.post<changePassword>('/user/change-password', {
      password,
      token,
    })
  }

  const emailVerify = async (token: string) => {
    await api.post<emailVerify>('/user/verify-email', {
      token,
    })
  }

  return {
    menuTheme,
    user,
    systemInformation,
    setMenuTheme,
    register,
    sendCode,
    sendVerifyEmail,
    changePassword,
    emailVerify,
  }
})
