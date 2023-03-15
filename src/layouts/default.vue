<script lang="ts" setup>
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue'

import { useTranslation } from '@/composables/lang'
import { useAuthStore, usePlayerStore, useUsersStore } from '@/stores'
import { useQuasar } from 'quasar'
import DynamicIcon from '@/components/DynamicIcon.vue'
import RouterViewTransition from '@/components/RouterViewTransition.vue'
import gCardPremium from '@/components/gCardPremium/gCardPremium.vue'
import gPlayer from '@/components/gPlayer/gPlayer.vue'

const { t } = useTranslation()

const usersStore = useUsersStore()
const playerStore = usePlayerStore()

const authStore = useAuthStore()
const authUser = computed<any>(() => authStore.user)
const isAuth = computed<boolean>(() => !!authStore.user)

const leftDrawerOpen = ref<boolean>(false)
const search = ref<string>('')

defineComponent({
  components: {
    DynamicIcon,
    gCardPremium,
    gPlayer,
  },
})

const navs = computed(() =>
  isAuth.value
    ? [
        {
          path: '/',
          name: t('layouts.navs.home'),
          icon: 'home',
        },
        {
          path: '/explore',
          name: t('layouts.navs.explore'),
          icon: 'explore',
        },
        {
          path: '/library',
          name: t('layouts.navs.library'),
          icon: 'library',
        },
        {
          path: '/profile',
          name: t('layouts.navs.profile'),
          icon: 'profile',
        },
      ]
    : [
        {
          path: '/',
          name: t('layouts.navs.home'),
          icon: 'home',
        },
        {
          path: '/explore',
          name: t('layouts.navs.explore'),
          icon: 'explore',
        },
        {
          path: '/login',
          name: t('layouts.navs.login'),
          icon: 'profile',
        },
      ]
)

const $q = useQuasar()

interface Data {
  isMobile: boolean
  volume: number
  muted: boolean
  music: Music
  list: string[] | any
}

interface Music {
  title: string
  artist: string
  src: string
  pic: string
}

const data: Data = reactive({
  isMobile: false,
  volume: 1,
  muted: false,
  music: {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    src: '/audio/The_Weeknd_Blinding_Lights.mp3',
    pic: '/audio/avatars/The_Weeknd.jpeg',
  },
  list: [
    {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      src: '/audio/The_Weeknd_Blinding_Lights.mp3',
      pic: '/audio/avatars/The_Weeknd.jpeg',
    },
    {
      title: '7 rings',
      artist: 'Ariana Grande',
      src: '/audio/Ariana_Grande_7_rings.mp3',
      pic: '/audio/avatars/Ariana_Grande.jpeg',
    },
    {
      title: 'WITHOUT YOU',
      artist: 'The Kid LAROI.',
      src: '/audio/The_Kid_LAROI_WITHOUT_YOU.mp3',
      pic: '/audio/avatars/The_Kid_LAROI.jpeg',
    },
  ],
})

let player = ref<any>(null)

onMounted(() => {
  usersStore.setMenuTheme(
    !!JSON.parse(localStorage.getItem('darkMode') as string)
  )
  playerStore.player = player.value

  window.addEventListener('resize', classesLayout)
  window.addEventListener('DOMContentLoaded', classesLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', classesLayout)
  window.removeEventListener('DOMContentLoaded', classesLayout)
})

const classesLayout = () => {
  usersStore.systemInformation = { ...$q.platform, ...$q.screen }

  data.isMobile = $q.screen.name === 'xs'
  return $q.screen.name === 'xs' ? 'hHh lpR fFf' : 'lHh lpR fFf'
}

const avatarOrFullName = computed<string>(() =>
  typeof authUser.value.avatar !== 'undefined' && authUser.value.avatar !== ''
    ? authUser.value.avatar
    : authStore.fullname[0].toUpperCase()
)

// const toggleLeftDrawer = () => {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }
</script>

<template>
  <q-layout :view="classesLayout()">
    <q-drawer
      v-model="leftDrawerOpen"
      :width="240"
      behavior="desktop"
      bordered
      class="q-drawer q-drawer__default"
      show-if-above
      side="left"
    >
      <div v-if="!data.isMobile" class="q-drawer__logo">
        <router-link to="/"></router-link>
      </div>

      <div class="q-drawer__nav">
        <router-link
          v-for="(item, index) in navs"
          :key="index"
          :to="item.path"
          class="q-drawer__nav-item"
        >
          <DynamicIcon
            :size="28"
            :name="item.icon"
            class="q-drawer__nav-icon"
          />

          <span class="q-drawer__nav-label">{{ item.name }}</span>
        </router-link>
      </div>

      <g-card-premium class="q-drawer__card" />

      <q-btn
        :label="t('layouts.buttonInstallApp')"
        :ripple="false"
        class="q-drawer__install-app icon-left"
        flat
        text-color="''"
        unelevated
      >
        <DynamicIcon class="on-left" name="download" />
      </q-btn>
    </q-drawer>

    <q-page-container>
      <RouterViewTransition></RouterViewTransition>
    </q-page-container>

    <g-player
      ref="player"
      shuffle
      repeat="list"
      :muted="data.muted"
      :volume="data.volume"
      :music="data.list[0]"
      :list="data.list"
      fixed
    />
  </q-layout>
</template>
