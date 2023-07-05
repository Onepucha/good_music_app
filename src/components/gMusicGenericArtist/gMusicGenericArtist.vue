<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, defineComponent, reactive } from 'vue'
import { Artist, Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { useTranslation } from '@/composables/lang'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores'
import { copyToClipboard } from 'quasar'

const route = useRoute()
const { t } = useTranslation()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
  },
})

interface Data {
  menuTheme: boolean
}

const props = defineProps<{
  artist?: Artist | undefined
  song: Song
  songs?: Array<Song> | undefined
}>()

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})
const authStore = useAuthStore()

const followBtnText = computed<string>(() => {
  return props.artist?.is_liked ? 'Following' : 'Follow'
})

const followBtnClass = computed<string>(() => {
  return props.artist?.is_liked ? 'q-btn-border' : ''
})

const emit = defineEmits([
  'add-follow',
  'toggleplay',
  'download',
  'download-songs',
  'add-playlist',
  'dont-play-this',
])

const toggleFollow = (artist: Artist | undefined) => {
  emit('add-follow', { follow: !props.artist?.is_liked, artist })
}

const onAudioToggle = () => {
  if (!authStore.user) {
    alertStore.error(t('notPlayingAuth'))
    return false
  }
  emit('toggleplay', {
    song: props.song,
    id: playerStore.getMusicIndex,
    index: 0,
  })
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

const downloadSongs = () => {
  emit('download-songs', props.artist?._id, props.artist)
}

const addPlayList = () => {
  emit('add-playlist', props.song)
}

const dontPlayThis = () => {
  emit('dont-play-this', props.song)
}
</script>

<template>
  <div class="g-music-generic-artist">
    <div class="g-music-generic-artist__head">
      <q-avatar
        :size="'200px'"
        class="g-music-generic-artist__picture"
        :class="{
          'g-music-generic-artist__picture-default': !props.artist?.cover_src,
        }"
      >
        <template v-if="props.artist?.cover_src">
          <img :alt="props.artist?.name" :src="props.artist?.cover_src" />
        </template>
      </q-avatar>

      <h3 class="g-music-generic-artist__title">
        {{ props.artist?.name }}
      </h3>

      <div
        v-if="props.artist?.monthlyListeners"
        class="g-music-generic-artist__info"
      >
        <div class="g-music-generic-artist__info-description">
          {{ props.artist?.monthlyListeners }}
          {{ t('pages.artist.monthlyListeners') }}
        </div>
      </div>
    </div>

    <div class="g-music-generic-artist__main">
      <div class="g-music-generic-artist__actions">
        <q-btn
          v-if="authStore.user"
          :class="followBtnClass"
          :label="followBtnText"
          class="q-btn-medium"
          rounded
          text-color="''"
          unelevated
          @click.prevent="toggleFollow(props.artist)"
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
                @click.prevent="addPlayList"
              >
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="add_playlist" />
                </q-item-section>

                <q-item-section>
                  {{ t('gMusicGenericArtist.addToPlaylist') }}
                </q-item-section>
              </q-item>

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
                  {{ t('gMusicGenericArtist.dontPlayThis') }}
                </q-item-section>
              </q-item>

              <q-item
                v-if="authStore.user && props.song"
                v-close-popup
                clickable
                @click.prevent="downloadSongs"
              >
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="download_song" />
                </q-item-section>

                <q-item-section>
                  {{ t('gMusicGenericArtist.download') }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click.prevent="setShare">
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="share" />
                </q-item-section>

                <q-item-section>
                  {{ t('gMusicGenericArtist.share') }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </i>
      </div>

      <div v-if="props.song" class="g-music-generic-artist__side-actions">
        <g-play-btn
          :playing="playerStore.playing"
          @click.prevent="onAudioToggle"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
