<script lang="ts" setup>
import { defineComponent, reactive } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicSongList from '@/components/gMusicSong/gMusicSongList.vue'
import { useTranslation } from '@/composables/lang'
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
  loading: boolean
  finished: boolean
}

const data: Data = reactive({
  artist: undefined,
  songs: [],
  page: 1,
  loading: false,
  finished: false,
})

const getSongs = async () => {
  if (data.loading || data.finished) return
  data.loading = true

  try {
    const response = await Songs.getLiked({
      page: data.page,
    })

    const newSongs = response.data.songs
    if (newSongs.length === 0) {
      data.finished = true
    } else {
      data.songs = [...data.songs, ...newSongs]
      data.page += 1
    }
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
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
            v-model="data.loading"
            :offset="250"
            @load="getSongs"
          >
            <g-music-song-list
              :list="data.songs"
              :artist="data.artist?.name"
              :artist-id="data.artist?._id"
            />

            <template v-if="data.loading && !data.finished" #loading>
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
