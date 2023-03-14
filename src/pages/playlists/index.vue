<script lang="ts" setup>
import { defineComponent } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
  },
})
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            icon="back"
            :label="t('pages.playlists.buttonBackPlaylists')"
            @click.prevent="$router.go(-1)"
          />

          <div class="q-page__header-actions">
            <DynamicIcon name="search" :size="28" />

            <div class="q-page__header-dropdown">
              <i class="g-icon g-icon-dropdown-menu">
                <span></span>
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
layout: default
</route>
