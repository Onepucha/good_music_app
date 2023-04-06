<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.user) {
    router.replace(`/library/${authStore.user?.nickname}`)
  } else {
    router.replace('/')
  }
})
</script>

<template>
  <div class="q-page"></div>
</template>
