<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'
import { Chart, Song } from '@/types/artist'

import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gChartInfo from '@/components/gChartInfo/gChartInfo.vue'
import gMusicAlbum from '@/components/gMusicAlbum/gMusicAlbum.vue'
import { useTranslation } from '@/composables/lang'
import { useAlbumsStore } from '@/stores/albums.store'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gLoader,
    gChartInfo,
    gMusicAlbum,
  },
})

const chart = reactive<Chart>({
  _id: '1',
  __v: 1,
  name: 'TOP ALBUMS GLOBAL',
  description: 'The most played albums from last week.',
  code: '1',
  info: ['By Hearme', '12/24/2022'],
})

const isLoading = ref<boolean>(true)

interface Data {
  albumList: Array<Song> | undefined
}

const data: Data = reactive({
  albumList: [],
})

const getAlbums = async (index: number, done: () => void) => {
  try {
    const albumsStore = useAlbumsStore()

    await done()

    data.albumList = await albumsStore.getAlbums()
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
  }
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back icon="back" @click.prevent="$router.go(-1)" />
        </div>

        <g-chart-info :chart="chart" />

        <q-infinite-scroll
          class="g-music-album-list"
          :offset="250"
          @load="getAlbums"
        >
          <g-music-album
            v-for="(album, index) in data.albumList"
            :key="index"
            :album="album"
          />

          <template #loading>
            <div class="row justify-center q-my-md">
              <g-loader />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>
