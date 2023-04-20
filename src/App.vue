<script lang="ts" setup>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

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
</script>

<template>
  <router-view />
</template>
