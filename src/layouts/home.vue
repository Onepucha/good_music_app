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
import { useAuthStore } from '@/stores'
import { useQuasar } from 'quasar'
import DynamicIcon from '@/components/DynamicIcon.vue'
import RouterViewTransition from '@/components/RouterViewTransition.vue'
import gCardPremium from '@/components/gCardPremium/gCardPremium.vue'
import { useUsersStore } from '@/stores/'
import { CustomWindow } from '@/types/options'

const { t } = useTranslation()
const usersStore = useUsersStore()

const authStore = useAuthStore()
const authUser = computed<any>(() => authStore.user)
const isAuth = computed<boolean>(() => !!authStore.user)

const leftDrawerOpen = ref<boolean>(false)
const search = ref<string>('')

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

interface ScrollPos {
  prev: number
  current: number
}

const isHidden = ref<boolean>(false)
const scrollPos = ref<ScrollPos>({ prev: 0, current: 0 })

const handleScroll = () => {
  scrollPos.value = {
    prev: scrollPos.value.current,
    current: window.pageYOffset,
  }
  isHidden.value = scrollPos.value.prev < scrollPos.value.current
}

const throttle = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...args: T) {
    if (!timeout) {
      timeout = setTimeout(() => {
        callback.apply(this, args)
        timeout = null
      }, delay)
    }
  }
}

const handleThrottledScroll = throttle(handleScroll, 250)

const promptEvent = ref<any>((window as CustomWindow).deferredPrompt)

const installApp = async (): Promise<void> => {
  if (!promptEvent.value) {
    return
  }
  promptEvent.value.prompt()
  const result = await promptEvent.value.userChoice
  ;(window as CustomWindow).deferredPrompt = null
}

const openSearch = () => {
  authStore.searchModal = true
}

onMounted(() => {
  usersStore.setMenuTheme(
    !!JSON.parse(localStorage.getItem('darkMode') as string)
  )

  window.addEventListener('resize', classesLayout)
  window.addEventListener('DOMContentLoaded', classesLayout)
  window.addEventListener('scroll', () => {
    if ($q.platform.is.mobile) {
      handleThrottledScroll()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', classesLayout)
  window.removeEventListener('DOMContentLoaded', classesLayout)
  window.removeEventListener('scroll', handleThrottledScroll)
})
</script>

<template>
  <q-layout
    :view="classesLayout()"
    class="q-layout-home"
    :class="{ 'is-hidden-drawer': isHidden }"
  >
    <q-header class="q-header" reveal>
      <q-toolbar class="q-header__toolbar">
        <div
          v-if="data.isMobile"
          :class="{ 'q-header__logo-full': !isAuth }"
          class="q-header__logo"
        >
          <router-link to="/"></router-link>
        </div>

        <router-link v-if="isAuth" class="q-header__profile" to="/profile">
          <div class="q-header__profile-avatar">
            <q-avatar :size="'32px'" :color="authUser?.avatar ? '' : 'primary'">
              <template v-if="authUser.avatar">
                <img :alt="authUser.fullname" :src="authUser.avatar" />
              </template>

              <template v-else>
                {{ avatarOrFullName }}
              </template>
            </q-avatar>
          </div>
          <div v-if="authUser.fullname" class="q-header__profile-name">
            {{ authUser.fullname }}
          </div>
        </router-link>

        <div class="q-header__search-container" @click.prevent="openSearch">
          <q-input
            v-if="!data.isMobile"
            v-model="search"
            :placeholder="t('layouts.placeholderSearch')"
            class="q-header__search-input"
            dense
          />
          <q-btn :ripple="false" class="q-header__search-btn" unelevated>
            <DynamicIcon :size="28" name="search" />
          </q-btn>
        </div>

        <q-btn
          v-if="isAuth"
          :ripple="false"
          class="q-header__ball-btn"
          unelevated
        >
          <DynamicIcon :size="28" name="ball" />
        </q-btn>

        <q-btn
          v-if="!isAuth"
          :label="t('layouts.buttonLogin')"
          class="q-header__login icon-left"
          rounded
          text-color="''"
          to="/login"
          unelevated
        >
          <DynamicIcon class="on-left" name="login" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <div class="q-drawer" :class="{ 'is-hidden': isHidden }">
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
    </div>

    <q-page-container>
      <RouterViewTransition></RouterViewTransition>
    </q-page-container>
  </q-layout>
</template>
