<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import gPlayer from '@/components/gPlayer/gPlayer.vue'
import gMusicSearchModal from '@/components/gMusicSearchModal/gMusicSearchModal.vue'
import { CustomWindow } from '@/types/options'
import { Song } from '@/types/artist'
import { useAuthStore, useLoadingStore, usePlayerStore } from '@/stores'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const loadingStore = useLoadingStore()

defineComponent({
  name: 'App',
  components: {
    gPlayer,
    gMusicSearchModal,
  },
})

const $q = useQuasar()
let player = ref<any>(null)

interface Data {
  volume: number
  muted: boolean
  music: Song
  list: Array<Song>
}

const data: Data = reactive({
  volume: 1,
  muted: false,
  music: {
    _id: '1',
    title: 'Blinding Lights',
    artist: {
      _id: '1',
      name: 'The Weeknd',
    },
    src: '/audio/The_Weeknd_Blinding_Lights.mp3',
    pic: '/audio/avatars/The_Weeknd.jpeg',
  },
  list: [
    {
      _id: '1',
      title: 'Blinding Lights',
      artist: {
        _id: '1',
        name: 'The Weeknd',
      },
      src: '/audio/The_Weeknd_Blinding_Lights.mp3',
      pic: '/audio/avatars/The_Weeknd.jpeg',
    },
    {
      _id: '2',
      title: '7 rings',
      artist: {
        _id: '2',
        name: 'Ariana Grande',
      },
      src: '/audio/Ariana_Grande_7_rings.mp3',
      pic: '/audio/avatars/Ariana_Grande.jpeg',
    },
    {
      _id: '3',
      title: 'WITHOUT YOU',
      artist: {
        _id: '3',
        name: 'The Kid LAROI.',
      },
      src: '/audio/The_Kid_LAROI_WITHOUT_YOU.mp3',
      pic: '/audio/avatars/The_Kid_LAROI.jpeg',
    },
  ],
})

const hidePlayerPage = computed<boolean>(() => {
  return (
    route.name === 'Login' ||
    route.name === 'Register' ||
    route.name === 'Forgot password' ||
    route.name === 'Reset password'
  )
})

if (JSON.parse(localStorage.getItem('darkMode') as string)) {
  $q.dark.set(true)
} else {
  $q.dark.set(false)
}

const customWindow: CustomWindow = window

onMounted(() => {
  playerStore.player = player.value
  playerStore.setMusicList(data.list)
  playerStore.setMusic(
    {
      _id: data.music._id,
      title: data.music?.title,
      artist: data.music?.artist,
      src: data.music?.src,
      pic: data.music?.pic,
    } as Song,
    0
  )

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

  <g-player
    v-if="!hidePlayerPage"
    ref="player"
    shuffle
    repeat="list"
    :muted="data.muted"
    :volume="data.volume"
    :music="data.list[0]"
    :list="data.list"
    fixed
  />

  <g-music-search-modal v-model="authStore.searchModal" />
</template>
