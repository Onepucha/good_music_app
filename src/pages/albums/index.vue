<script lang="ts" setup>
import { defineComponent, onMounted, reactive } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gMusicAlbum from '@/components/gMusicAlbum/gMusicAlbum.vue'
import { useTranslation } from '@/composables/lang'
import { useAlbumsStore } from '@/stores/albums.store'
import { Song } from '@/types/artist'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    DynamicIcon,
    gMusicAlbum,
  },
})

interface Data {
  albumList: Array<Song> | undefined
}

const data: Data = reactive({
  albumList: [],
})

onMounted(async () => {
  const albumsStore = useAlbumsStore()

  data.albumList = await albumsStore.getAlbums()
})
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            icon="back"
            :label="t('pages.albums.buttonBackAlbums')"
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

        <g-music-album
          v-for="album in data.albumList"
          :key="album._id"
          :album="album"
        />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
layout: default
</route>
