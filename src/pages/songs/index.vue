<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import { useTranslation } from '@/composables/lang'
import { AxiosResponse } from 'axios'
import Songs from '@/services/songs'
import { Artist, Song } from '@/types/artist'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    DynamicIcon,
    gLoader,
    gMusicSongList,
  },
})

interface Data {
  artist: Artist | undefined
  songs: Array<Song>
  page: number
}

const data: Data = reactive({
  artist: undefined,
  songs: [],
  page: 0,
})

const scrollTargetRef = ref<any>(document.createElement('div'))

const getSongs = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: AxiosResponse = await Songs.getLiked({
      page: data.page,
    })

    if (response.data.songIds.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()
    data.songs = data.songs.concat(response.data.songIds)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            icon="back"
            :label="t('pages.songs.buttonBackSongs')"
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

        <q-list class="scroll">
          <q-infinite-scroll
            ref="scrollTargetRef"
            :offset="250"
            @load="getSongs"
          >
            <g-music-song-list
              v-if="data.songs.length"
              :list="data.songs"
              :artist="data.artist?.name"
              :artist-id="data.artist?._id"
            />

            <template #loading>
              <div class="row justify-center q-my-md">
                <g-loader />
              </div>
            </template>
          </q-infinite-scroll>
        </q-list>
      </div>
    </div>
  </div>
</template>
