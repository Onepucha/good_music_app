<script lang="ts" setup>
import { onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.name === 'Artists') {
    router.push('artists/singers')
  } else {
    router.replace('/')
  }
})
</script>

<template>
  <div class="q-page"></div>
</template>
