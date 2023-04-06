<script lang="ts" setup>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import MainLoader from '@/components/MainLoader.vue'

defineComponent({
  name: 'App',
  components: {
    MainLoader,
  },
})

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
