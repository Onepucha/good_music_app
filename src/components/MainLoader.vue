<script setup lang="ts">
import gLoader from '@/components/gLoader/gLoader.vue'
import { defineComponent } from 'vue'

defineComponent({
  components: {
    gLoader,
  },
})
</script>

<template>
  <div class="g-main-loader">
    <img src="/images/nav_logo.svg" alt="" />
    <g-loader class="g-main-loader__loading" />
  </div>
</template>
