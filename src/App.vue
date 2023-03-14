<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores'
import { deleteCookie, getCookie } from '@/utils/utils'
import { api } from '@/boot/axios'
import { useQuasar } from 'quasar'
import MainLoader from '@/components/MainLoader.vue'

defineComponent({
  name: 'App',
  components: {
    MainLoader,
  },
})

const isLoading = ref<boolean>(true)

const getUser = async () => {
  const authStore = useAuthStore()

  try {
    if (getCookie('test-session')) {
      let response = await api.get('user/info')
      isLoading.value = false
      authStore.user = response.data.user
    } else {
      await deleteCookie('test-session')
      isLoading.value = false
      // await router.push('/login')
    }
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
    // await router.push('/login')
  }
}

getUser()

const $q = useQuasar()

if (JSON.parse(localStorage.getItem('darkMode') as string)) {
  $q.dark.set(true)
} else {
  $q.dark.set(false)
}
</script>

<template>
  <router-view />
  <main-loader />
</template>
