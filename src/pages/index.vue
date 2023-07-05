<template>
  <div class="q-page q-page__home">
    <div class="row">
      <div class="col-12 col-md-12">
        <g-music-gallery-list
          v-if="data.newReleases.length"
          :list="data.newReleases"
          :sub-title="t('pages.home.galleryListReleases.subTitle')"
          :title="t('pages.home.galleryListReleases.title')"
          :type="'new-releases'"
          click-to-play
          overflow
          @toggleplay="onAudioToggle"
          @set-liked="setLiked"
        />

        <g-music-gallery-list
          v-if="data.popularArtists.length"
          :list="data.popularArtists"
          :sub-title="t('pages.home.galleryListPopularArtists.subTitle')"
          :title="t('pages.home.galleryListPopularArtists.title')"
          :type="'artist'"
          overflow
        />

        <g-music-gallery-list
          v-if="data.topCharts.length"
          :list="data.topCharts"
          :sub-title="t('pages.home.galleryListTopCharts.subTitle')"
          :title="t('pages.home.galleryListTopCharts.title')"
          :type="'chart'"
          overflow
        />

        <q-dialog
          ref="qDialogPopup"
          v-model="dialogEmail"
          :position="position"
          class="g-popup"
        >
          <q-card>
            <q-card-section class="g-popup__body text-center">
              <h4>{{ t('pages.home.successEmailModal.title') }}</h4>
              <h5>
                {{ t('pages.home.successEmailModal.description') }}
              </h5>
              <div class="g-popup__action">
                <q-btn
                  v-close-popup
                  :label="t('pages.home.successEmailModal.btn')"
                  class="g-popup__btn q-btn-large"
                  rounded
                  text-color="''"
                  unelevated
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { Album, Artist, Chart, Song } from 'src/types/artist'

import gMusicGalleryList from 'components/gMusicGallery/gMusicGalleryList.vue'

import {
  useAlertStore,
  useArtistsStore,
  useAuthStore,
  useChartsStore,
  useLoadingStore,
  usePlayerStore,
  useUsersStore,
} from 'src/stores'
import { useTranslation } from 'src/composables/lang'
import { useRoute } from 'vue-router'
import Albums from '@/services/albums'
import Songs from '@/services/songs'
import { useMeta } from 'quasar'

const { t } = useTranslation()
const route = useRoute()
const usersStore = useUsersStore()
const loadingStore = useLoadingStore()
const alertStore = useAlertStore()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    gMusicGalleryList,
  },
})

const authStore = useAuthStore()
const dialogEmail = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')

interface Data {
  artists: Array<Artist>
  newReleases: Array<Artist> | Array<Album>
  popularArtists: string[] | undefined
  topCharts: Array<Chart> | undefined
  isLoading: boolean
  isDisabled: boolean
  page: number
  artistCount: number
}

const data: Data = reactive({
  artists: [],
  newReleases: [],
  popularArtists: [],
  topCharts: [],
  isLoading: false,
  isDisabled: false,
  page: 0,
  artistCount: 24,
})

useMeta(() => {
  return {
    title: t('pages.home.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.home.contentHead'),
      },
    },
  }
})

const getPopularArtist = async () => {
  const artistStore = useArtistsStore()

  try {
    const response: any = await artistStore.getAllArtists({
      count: 6,
    })

    data.popularArtists = response?.data
  } catch (error: unknown) {
    console.error(error)
  }
}

const getReleases = async () => {
  try {
    const response: any = await Albums.getReleases()

    data.newReleases = response.data.albums
  } catch (error: unknown) {
    console.error(error)
  }
}

const getCharts = async () => {
  const releasesStore = useChartsStore()

  try {
    data.topCharts = await releasesStore.getCharts()
  } catch (error: unknown) {
    console.error(error)
  }
}

const emailVerify = async () => {
  try {
    data.isLoading = true

    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())

    if (
      route.query.token === params.token &&
      typeof params.token !== 'undefined'
    ) {
      await usersStore.emailVerify(route.query.token)
      dialogEmail.value = true
      await authStore.userInfo()
    }
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
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
  try {
    if (item && item.song && item.song.songs && item.song.songs.length > 0) {
      const artist: Artist = item.song?.artists?.at(0) as Artist
      const songUrl = await Songs.playSong(item.song.songs[0])
      const songList = await Songs.getAll({
        id: artist?._id,
      })

      playerStore.setMusicList(songList.data.songs || [])

      playerStore.setMusic(
        {
          _id: item.song.songs[0],
          title: item.song?.name,
          artist: item.song?.artists?.at(0),
          src: songUrl.data?.url,
          pic: item.song?.cover_src,
          is_liked: item.song?.is_liked,
          genres: item.song?.genres,
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

onMounted(async () => {
  loadingStore.setLoading()
  await emailVerify()
  await getReleases()
  await getPopularArtist()
  // await getCharts()
  loadingStore.hideLoading()
})
</script>
