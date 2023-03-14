<script setup lang="ts">
import { defineComponent } from 'vue'
import { Chart } from '@/types/artist'

import gChartInfo from '@/components/gChartInfo/gChartInfo.vue'

defineComponent({
  components: {
    gChartInfo,
  },
})

interface Props {
  title?: string
  artist: string
  list: Array<Chart>
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  list: () => [],
  artist: '',
})
</script>

<template>
  <div class="g-music-chart-list">
    <div class="g-music-chart-list__wrap">
      <div v-if="props.title" class="g-music-chart-list__head">
        <h4 class="g-music-chart-list__head-title" v-html="props.title"></h4>
      </div>

      <div class="g-music-chart-list__body">
        <g-chart-info v-for="chart of list" :key="chart._id" :chart="chart" />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<style scoped></style>
