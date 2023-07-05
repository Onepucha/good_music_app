<script lang="ts" setup>
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { useMeta } from 'quasar'

import gBack from '@/components/gBack/gBack.vue'
import gMusicGalleryList from '@/components/gMusicGallery/gMusicGalleryList.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { Artist, Song } from '@/types/artist'

import { useTranslation } from '@/composables/lang'
import Albums from '@/services/albums'
import { useAlertStore, useAuthStore, usePlayerStore } from '@/stores'
import Songs from '@/services/songs'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useTranslation()
const authStore = useAuthStore()
const alertStore = useAlertStore()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    gBack,
    gMusicGalleryList,
    gMusicSongListNotFound,
    gLoader,
    DynamicIcon,
  },
})

const title = ref('Some title')

useMeta(() => {
  return {
    title: t('pages.newReleases.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.newReleases.contentHead'),
      },
    },
  }
})

interface Data {
  newReleases: Array<Artist>
  page: number
  releasesCount: number
  isLoading: boolean
}

const data: Data = reactive({
  newReleases: [],
  page: 0,
  releasesCount: 24,
  isLoading: false,
})

const scrollTargetRef = ref<any>(document.createElement('div'))
const noMoreItems = ref<boolean>(false)

const getAllNewReleases = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await Albums.getAll({
      count: data.releasesCount,
      page: data.page,
    })

    if (response.data.albums.length === 0) {
      scrollTargetRef.value.stop()
      noMoreItems.value = true
    } else {
      data.newReleases = (data.newReleases as Artist[]).concat(
        response.data.albums
      )
    }

    done()
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
}

const openSearch = () => {
  authStore.searchModal = true
}

const onAudioToggle = (item: {
  song: Song
  id: number | string
  index: number
}) => {
  if (playerStore.playing && playerStore.getMusicIndex === item.id) {
    onAudioPause()
  } else {
    if (
      playerStore.getMusicIndex !== null &&
      playerStore.getMusicIndex === item.id
    ) {
      playerStore.setPlaying(true)

      nextTick(() => {
        playerStore.player.play()
      })
    } else {
      onAudioPlay({ song: item.song, id: item.id, index: item.index })
    }
  }
}

const onAudioPlay = async (item: {
  song: Song
  id: number | string
  index: number
}) => {
  console.log(item)
  try {
    if (item && item.song && item.song.songs && item.song.songs.length > 0) {
      const artist: Artist = item.song?.artists?.at(0) as Artist
      const song: Song = item.song?.songs?.at(0) as Song

      const songUrl = await Songs.playSong(song?._id)
      const songList = await Songs.getAll({
        id: artist?._id,
      })

      playerStore.setMusicList(songList.data.songs || [])

      playerStore.setMusic(
        {
          _id: song?._id,
          title: song?.name,
          artist: artist,
          src: songUrl.data?.url,
          pic: song?.cover_src,
          is_liked: song?.is_liked,
          genres: song?.genres,
        } as Song,
        item.id as number
      )
      playerStore.setPlaying(true)

      nextTick(() => {
        playerStore.player.play()
      })
    }
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const onAudioPause = () => {
  playerStore.setPlaying(false)
  playerStore.player.pause()
}

const setLiked = async (
  isSingle: boolean,
  object: {
    ids: string[]
    is_add_to_liked: boolean
  }
) => {
  try {
    await Albums.setFollow(object.ids, object.is_add_to_liked)

    const index = data.newReleases?.findIndex(
      (album) => album._id === object.ids.at(0)
    )

    if (
      data &&
      data.newReleases &&
      data.newReleases.length > 0 &&
      index !== undefined &&
      data.newReleases[index].is_liked !== undefined
    ) {
      data.newReleases[index].is_liked = object.is_add_to_liked
    }

    if (object.is_add_to_liked) {
      alertStore.success(t('successLiked'))
    } else {
      alertStore.success(t('successNotLiked'))
    }
  } catch (error: unknown) {
    console.error(error)
    alertStore.error(t('error'))
  }
}
</script>

<template>
  <div class="q-page">
    <div class="q-page__header">
      <g-back
        :label="t('pages.newReleases.buttonBackPopularNewReleases')"
        icon="back"
        @click.prevent="$router.go(-1)"
      />
      <DynamicIcon :size="28" name="search" @click.prevent="openSearch" />
    </div>

    <div>
      <q-infinite-scroll
        ref="scrollTargetRef"
        :offset="250"
        @load="getAllNewReleases"
      >
        <g-music-gallery-list
          :list="data.newReleases"
          :type="'album'"
          click-to-play
          @toggleplay="onAudioToggle"
          @set-liked="setLiked"
        />

        <g-music-song-list-not-found v-if="noMoreItems" />

        <template #loading>
          <div class="row justify-center q-my-md">
            <g-loader />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>
</template>
