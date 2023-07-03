<script lang="ts" setup>
import { computed, defineComponent, reactive } from 'vue'
import { Artist, Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { useTranslation } from '@/composables/lang'
import { RouteLocationRaw, useRoute } from 'vue-router'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores/'
import { copyToClipboard } from 'quasar'

const route = useRoute()
const { t } = useTranslation()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
  },
})

const props = defineProps<{
  song: Song
  artist?: Artist
  artistId?: RouteLocationRaw
}>()

interface Data {
  menuTheme: boolean
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const findArtist = computed<Artist | undefined>(() => {
  return props.artist ? props.artist : props.song?.artists?.at(0)
})

const findArtistId = computed<string | RouteLocationRaw | undefined>(() => {
  return props.artistId ? props.artistId : props.song?.artists?.at(0)?._id
})

const emit = defineEmits([
  'toggleplay',
  'set-liked',
  'download',
  'go-to-album',
  'add-playlist',
  'dont-play-this',
  'view-artist',
])

const onAudioToggle = () => {
  emit('toggleplay', props.song)
}

const setLiked = () => {
  emit('set-liked', true, {
    ids: [props.song?._id],
    is_add_to_liked: !props.song?.is_liked,
  })
}

const addPlayList = () => {
  emit('add-playlist', props.song)
}

const dontPlayThis = () => {
  emit('dont-play-this', props.song)
}

const downloadSong = () => {
  emit('download', props.song._id, props.song.name)
}

const goToAlbum = () => {
  emit('go-to-album', props.song?.albums?.at(0))
}

const setShare = () => {
  copyToClipboard(
    `${import.meta.env.VITE_API_URL}/artist/${findArtist.value?._id}/track/${
      props.song._id
    }`
  )
    .then(() => {
      alertStore.success(t('gMusicGenericArtist.successClipboard'))
    })
    .catch(() => {
      alertStore.error(t('gMusicGenericArtist.errorClipboard'))
    })
}

const viewArtist = () => {
  emit('view-artist', findArtist.value?._id)
}

const parentRouteName = computed(() => {
  const matchedRoutes = route.matched
  const parentRoute = matchedRoutes[matchedRoutes.length - 2]
  return parentRoute ? parentRoute.name : null
})

const findArtistPath = computed<boolean>(() => {
  return parentRouteName.value === 'Artist'
})

const findAlbumPath = computed<boolean>(() => {
  return parentRouteName.value === 'Album'
})
</script>

<template>
  <div class="g-music-song">
    <div class="g-music-song__content">
      <div
        class="g-music-song__picture"
        :class="{ 'g-music-song__picture-default': !props.song?.cover_src }"
      >
        <img
          v-if="props.song?.cover_src"
          :alt="props.song.name"
          :src="props.song?.cover_src"
        />
      </div>

      <div class="g-music-song__title">
        <div class="g-music-song__title-top">
          <router-link :to="`/artist/${findArtistId}/track/${props.song?._id}`">
            {{ props.song?.name || 'Untitled' }}
          </router-link>
        </div>

        <div v-if="findArtistId" class="g-music-song__title-description">
          <router-link :to="`/artist/${findArtistId}`">
            {{ findArtist.name || 'Unknown' }}
          </router-link>
        </div>
      </div>
    </div>

    <div class="g-music-song__action">
      <g-play-btn
        :playing="
          playerStore.playing && playerStore.musicId === props.song?._id
        "
        @click.prevent="onAudioToggle"
      />
      <i class="g-icon g-icon-dots" @click.prevent.stop="">
        <span></span>

        <q-menu
          class="popover-menu"
          fit
          :dark="data.menuTheme"
          anchor="bottom right"
        >
          <q-list>
            <q-item
              v-if="authStore.user"
              v-close-popup
              clickable
              @click.prevent="setLiked"
            >
              <q-item-section avatar>
                <DynamicIcon
                  :class="{ active: !!props.song?.is_liked }"
                  :size="20"
                  name="like"
                />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.like') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="authStore.user"
              v-close-popup
              clickable
              @click.prevent="addPlayList"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="add_playlist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.addToPlaylist') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="authStore.user"
              v-close-popup
              clickable
              @click.prevent="dontPlayThis"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="dont_play" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.dontPlayThis') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="authStore.user && props.song"
              v-close-popup
              clickable
              @click.prevent="downloadSong"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="download_song" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.download') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="!findArtistPath"
              v-close-popup
              clickable
              @click.prevent="viewArtist"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="artist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.viewArtist') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="!findAlbumPath"
              v-close-popup
              clickable
              @click.prevent="goToAlbum"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="play_album" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.gotoAlbum') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click.prevent="setShare">
              <q-item-section avatar>
                <DynamicIcon :size="20" name="share" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.share') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </i>
    </div>
  </div>
</template>

<style scoped></style>
