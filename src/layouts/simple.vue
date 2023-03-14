<script lang="ts" setup>
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores'
import DynamicIcon from '@/components/DynamicIcon.vue'
import RouterViewTransition from '@/components/RouterViewTransition.vue'
import gCardPremium from '@/components/gCardPremium/gCardPremium.vue'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gCardPremium,
  },
})

const leftDrawerOpen = ref<boolean>(false)

const authStore = useAuthStore()
const isAuth = computed(() => !!authStore.user)

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
  isMobile: $q.screen.name === 'xs',
})

onMounted(() => {
  window.addEventListener('DOMContentLoaded', classesLayout)
  window.addEventListener('resize', classesLayout)
})

onUnmounted(() => {
  window.removeEventListener('DOMContentLoaded', classesLayout)
  window.removeEventListener('resize', classesLayout)
})

const classesLayout = () => {
  data.isMobile = $q.screen.name !== 'xs'
  return $q.screen.name === 'xs' ? 'hHh lpR fFf' : 'lHh lpR fFf'
}
</script>

<template>
  <q-layout view="lHh lpr fFf">
    <q-drawer
      v-model="leftDrawerOpen"
      :width="240"
      behavior="desktop"
      bordered
      class="q-drawer"
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
          <DynamicIcon :name="item.icon" class="q-drawer__nav-icon" />

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
  </q-layout>
</template>

<style lang="scss"></style>
