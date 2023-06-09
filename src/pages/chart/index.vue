<script lang="ts" setup>
import { defineComponent, onMounted, reactive } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gMusicGalleryList from '@/components/gMusicGallery/gMusicGalleryList.vue'
import { useTranslation } from '@/composables/lang'
import { Chart } from '@/types/artist'
import { useAuthStore, useChartsStore } from '@/stores'
import { useMeta } from 'quasar'

const { t } = useTranslation()
const authStore = useAuthStore()

defineComponent({
  components: {
    gBack,
    DynamicIcon,
    gMusicGalleryList,
  },
})

useMeta(() => {
  return {
    title: t('pages.chart.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.chart.contentHead'),
      },
    },
  }
})

interface Data {
  charts: Array<Chart> | undefined
}

const data: Data = reactive({
  charts: [],
})

const openSearch = () => {
  authStore.searchModal = true
}

onMounted(async () => {
  const releasesStore = useChartsStore()

  data.charts = await releasesStore.getCharts()
})
</script>

<template>
  <div class="q-page q-page__chart">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            :label="t('pages.chart.buttonBackChart')"
            icon="back"
            @click.prevent="$router.go(-1)"
          />
          <DynamicIcon :size="28" name="search" @click.prevent="openSearch" />
        </div>

        <g-music-gallery-list
          :list="data.charts"
          :title="t('pages.chart.galleryListWeeklyAlbum.title')"
          :type="'chart'"
        />
      </div>
    </div>
  </div>
</template>
