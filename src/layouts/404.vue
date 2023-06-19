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

const { t } = useTranslation()

const usersStore = useUsersStore()

const authStore = useAuthStore()
const isAuth = computed<boolean>(() => !!authStore.user)

const leftDrawerOpen = ref<boolean>(false)

defineComponent({
  components: {
    DynamicIcon,
  },
})

const navs = computed(() => [
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
])

const $q = useQuasar()

interface Data {
  isMobile: boolean
}

const data: Data = reactive({
  isMobile: false,
})

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
    </q-drawer>

    <q-page-container>
      <RouterViewTransition></RouterViewTransition>
    </q-page-container>
  </q-layout>
</template>
