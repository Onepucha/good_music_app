<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores'
import RouterViewTransition from '@/components/RouterViewTransition.vue'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()

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
    <q-page-container>
      <RouterViewTransition></RouterViewTransition>
    </q-page-container>
  </q-layout>
</template>
