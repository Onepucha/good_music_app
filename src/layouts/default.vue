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
import { useAuthStore, useUsersStore } from '@/stores'
import { useQuasar } from 'quasar'
import DynamicIcon from '@/components/DynamicIcon.vue'
import RouterViewTransition from '@/components/RouterViewTransition.vue'
import gCardPremium from '@/components/gCardPremium/gCardPremium.vue'
import { CustomWindow } from '@/types/options'

const { t } = useTranslation()

const usersStore = useUsersStore()

const authStore = useAuthStore()
const authUser = computed<any>(() => authStore.user)
const isAuth = computed<boolean>(() => !!authStore.user)

const leftDrawerOpen = ref<boolean>(false)

defineComponent({
  components: {
    DynamicIcon,
    gCardPremium,
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
}

const data: Data = reactive({
  isMobile: false,
})

const promptEvent = ref<any>((window as CustomWindow).deferredPrompt)

const installApp = async (): Promise<void> => {
  if (!promptEvent.value) {
    return
  }
  promptEvent.value.prompt()
  const result = await promptEvent.value.userChoice
  ;(window as CustomWindow).deferredPrompt = null
}

onMounted(() => {
  usersStore.setMenuTheme(
    !!JSON.parse(localStorage.getItem('darkMode') as string)
  )

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
</script>

<template>
  <q-layout :view="classesLayout()">
    <q-drawer
      v-if="!data.isMobile"
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

      <div v-if="!data.isMobile" class="q-drawer__nav">
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
        v-if="promptEvent"
        :label="t('layouts.buttonInstallApp')"
        :ripple="false"
        class="q-drawer__install-app icon-left"
        flat
        text-color="''"
        unelevated
        @click="installApp"
      >
        <DynamicIcon class="on-left" name="download" />
      </q-btn>
    </q-drawer>

    <q-page-container>
      <RouterViewTransition></RouterViewTransition>
    </q-page-container>
  </q-layout>
</template>
