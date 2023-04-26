<script lang="ts" setup>
import { defineComponent, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { CustomWindow } from '@/types/options'
import { useLoadingStore } from '@/stores'

const loadingStore = useLoadingStore()

defineComponent({
  name: 'App',
  components: {},
})

const $q = useQuasar()

if (JSON.parse(localStorage.getItem('darkMode') as string)) {
  $q.dark.set(true)
} else {
  $q.dark.set(false)
}

const customWindow: CustomWindow = window

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    customWindow.deferredPrompt = event
  })

  window.addEventListener('appinstalled', (event) => {
    customWindow.deferredPrompt = null
  })
})
</script>

<template>
  <router-view v-if="!loadingStore.isLoading" />
</template>
