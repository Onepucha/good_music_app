<script lang="ts" setup>
import { defineComponent, reactive } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import { useTranslation } from '@/composables/lang'
import { useAuthStore } from '@/stores'
import { useMeta } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gMusicSongListNotFound,
  },
})

const authStore = useAuthStore()

interface Data {
  downloads: Array<string>
}

const data: Data = reactive({
  downloads: [],
})

useMeta(() => {
  return {
    title: t('pages.library.downloads.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.library.downloads.contentHead'),
      },
    },
  }
})

const openSearch = () => {
  authStore.searchModal = true
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            icon="back"
            :label="t('pages.downloads.buttonBackDownloads')"
            @click.prevent="$router.go(-1)"
          />

          <div class="q-page__header-actions">
            <DynamicIcon name="search" :size="28" @click.prevent="openSearch" />

            <div class="q-page__header-dropdown">
              <i class="g-icon g-icon-dropdown-menu">
                <span></span>
              </i>
            </div>
          </div>
        </div>

        <template v-if="data.downloads.length"></template>
        <g-music-song-list-not-found v-else />
      </div>
    </div>
  </div>
</template>
