<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gMusicFiltered,
  },
})

interface Playlist {
  name: string
  description: string
  playlistOptions: any
}

const data: Playlist = reactive({
  name: '',
  description: '',
  playlistOptions: {
    icon: 'public',
    label: 'Public',
  },
})

const isLoading = ref<boolean>(false)

const onRecently = () => {
  console.log('Recently')
}
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

        <q-tabs
          dense
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-route-tab
            :label="t('pages.playlists.tabs.singers')"
            to="singers"
            exact
          />
          <q-route-tab
            :label="t('pages.playlists.tabs.albums')"
            to="albums"
            exact
          />
        </q-tabs>

        <g-music-filtered
          :label="t('pages.playlists.label')"
          :recently="t('pages.playlists.recently')"
          @recently="onRecently"
        />
      </div>
    </div>
  </div>
</template>
