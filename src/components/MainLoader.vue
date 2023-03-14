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

<style lang="scss" scoped>
.g-main-loader {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__loading {
    margin: 240px 0 0;
  }
}
</style>
