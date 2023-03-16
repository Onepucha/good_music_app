<script lang="ts" setup>
import { defineComponent, onMounted, reactive } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gMusicGalleryList from '@/components/gMusicGallery/gMusicGalleryList.vue'
import { useTranslation } from '@/composables/lang'
import { Chart } from '@/types/artist'
import { useChartsStore } from '@/stores'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    DynamicIcon,
    gMusicGalleryList,
  },
})

interface Data {
  charts: Array<Chart> | undefined
}

const data: Data = reactive({
  charts: [],
})

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
          <DynamicIcon :size="28" name="search" />
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
