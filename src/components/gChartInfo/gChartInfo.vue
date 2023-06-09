<script setup lang="ts">
import { computed } from 'vue'
import { Chart } from '@/types/artist'
import { isEmpty } from '@/utils/utils'

import { useTranslation } from '@/composables/lang'
import { useUsersStore } from '@/stores'

const { t } = useTranslation()
const usersStore = useUsersStore()

const props = defineProps<{
  chart?: Chart | undefined
}>()

const infoLength = computed<boolean>(() => {
  return props.chart?.info ? props.chart?.info?.length > 0 : false
})

interface Info {
  name: string | undefined
  info: string | undefined
}

const nameAndInfoCharts = computed<Info>(() => {
  let nameAndInfo = props.chart?.name.split('-')

  return {
    name: nameAndInfo?.at(0),
    info: nameAndInfo?.at(1),
  }
})
</script>

<template>
  <div class="g-chart-info">
    <div class="g-chart-info__head">
      <div
        class="g-chart-info__picture"
        :class="{
          'g-chart-info__picture-default': !props.chart?.cover_src,
        }"
      >
        <template v-if="props.chart?.cover_src">
          <img :alt="props.chart.name" :src="props.chart?.cover_src" />
        </template>

        <template v-if="!isEmpty(nameAndInfoCharts)">
          <div class="g-music-gallery-item__gradient-title">
            {{ nameAndInfoCharts.name }}
          </div>

          <div
            v-if="nameAndInfoCharts.info"
            class="g-music-gallery-item__gradient-info"
          >
            {{ nameAndInfoCharts.info }}
          </div>
        </template>
      </div>

      <h4 class="g-chart-info__title">
        {{ props.chart?.name || 'Unknown' }}
      </h4>

      <div v-if="props.chart?.description" class="g-chart-info__description">
        {{ props.chart?.description }}
      </div>

      <div v-if="infoLength" class="g-chart-info__info">
        <span v-for="(item, index) in props.chart?.info" :key="index">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
