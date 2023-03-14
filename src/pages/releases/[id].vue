<script lang="ts" setup>
import { defineComponent } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
  },
})
</script>

<template>
  <div class="q-page">
    <g-back
      :label="t('pages.releases.buttonBackReleases')"
      icon="back"
      @click.prevent="$router.go(-1)"
    />
  </div>
</template>
