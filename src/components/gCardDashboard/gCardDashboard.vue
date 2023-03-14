<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'
import { computed } from 'vue'
import { Dashboards } from '@/types/dashboards'
const { t } = useTranslation()

const props = defineProps<{
  item: Dashboards
}>()

const backgroundDashboard = computed<string>(() => {
  return `background-image: url(${props.item.backgroundUrl})`
})
</script>

<template>
  <q-card class="g-card-dashboard">
    <router-link :to="props.item.href">
      <div :style="backgroundDashboard" class="g-card-dashboard__wrap">
        <q-card-section>
          <p class="text-xl text-weight-bold">
            {{ t(`dashboardCard.${props.item.title}`) }}
          </p>
        </q-card-section>
      </div>
    </router-link>
  </q-card>
</template>

<style scoped></style>
