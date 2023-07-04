<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { Album, Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import Readmore from '@/components/Readmore.vue'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores'
import { useTranslation } from '@/composables/lang'
import { copyToClipboard } from 'quasar'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useTranslation()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
    Readmore,
    gPlayBtn,
  },
})

const emit = defineEmits([
  'toggleplay',
  'add-playlist',
  'download',
  'download-songs',
  'dont-play-this',
  'view-artist',
  'set-liked',
])

interface Data {
  menuTheme: boolean
}

const props = defineProps<{
  album: Album
  song?: Song | undefined
}>()

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const infoLength = computed<boolean>(() => {
  return props.album?.description_en
    ? props.album?.description_en.length > 0
    : false
})

const onAudioToggle = () => {
  if (!authStore.user) {
    alertStore.error(t('notPlayingAuth'))
    return false
  }
  emit('toggleplay', { song: props.song, index: playerStore.getMusicIndex })
}

const setShare = () => {
  copyToClipboard(`${import.meta.env.VITE_API_URL}${route.path}`)
    .then(() => {
      alertStore.success(t('gMusicGenericArtist.successClipboard'))
    })
    .catch(() => {
      alertStore.error(t('gMusicGenericArtist.errorClipboard'))
    })
}

const downloadSong = () => {
  emit('download', props.song?._id, props.song?.name)
}

const downloadSongs = () => {
  emit('download-songs', props.album?._id, props.album)
}

const addPlayList = () => {
  emit('add-playlist', props.song)
}

const dontPlayThis = () => {
  emit('dont-play-this', props.song)
}

const viewArtist = () => {
  emit('view-artist', props.album?.artists?.at(0)?._id)
}

const setLiked = () => {
  emit('set-liked', true, {
    ids: [props.album?._id],
    is_add_to_liked: !props.album?.is_liked,
  })
}
</script>

<template>
  <div class="g-album-profiles">
    <div class="g-album-profiles__head">
      <q-avatar
        :size="'200px'"
        class="g-album-profiles__picture"
        :class="{
          'g-album-profiles__picture-default': !props.album?.cover_src,
        }"
      >
        <template v-if="props.album?.cover_src">
          <img :alt="props.album.name" :src="props.album?.cover_src" />
        </template>
      </q-avatar>

      <h3 class="g-album-profiles__title">
        {{ props.album?.name || 'Unknown' }}
      </h3>

      <div class="g-album-profiles__artist-name">
        {{ props.album?.artists?.at(0)?.name || 'Untitled' }}
      </div>
    </div>

    <div class="g-album-profiles__main">
      <div class="g-album-profiles__actions">
        <DynamicIcon
          v-if="authStore.user"
          :size="24"
          name="heart"
          :class="{ active: !!props.album?.is_liked }"
          @click.prevent="setLiked"
        />

        <DynamicIcon
          v-if="authStore.user"
          :size="24"
          name="add_playlist"
          @click.prevent="addPlayList"
        />

        <DynamicIcon
          v-if="authStore.user"
          :size="24"
          name="download_song"
          @click.prevent="downloadSongs"
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
                v-if="authStore.user && props.song"
                v-close-popup
                clickable
                @click.prevent="dontPlayThis"
              >
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="dont_play" />
                </q-item-section>

                <q-item-section>
                  {{ t('gAlbumProfiles.dontPlayThis') }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click.prevent="viewArtist">
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="artist" />
                </q-item-section>

                <q-item-section>
                  {{ t('gAlbumProfiles.viewArtist') }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click.prevent="setShare">
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="share" />
                </q-item-section>

                <q-item-section>
                  {{ t('gAlbumProfiles.share') }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </i>
      </div>

      <div v-if="props.song" class="g-album-profiles__side-actions">
        <g-play-btn
          :playing="playerStore.playing"
          @click.prevent="onAudioToggle"
        />
      </div>
    </div>

    <div v-if="infoLength" class="g-album-profiles__info-cell">
      <Readmore :slice="200" :long-text="props.album?.description_en" />
    </div>
  </div>
</template>

<style scoped></style>
