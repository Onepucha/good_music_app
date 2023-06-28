<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { Artist, Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import { useTranslation } from '@/composables/lang'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores'
import { copyToClipboard } from 'quasar'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useTranslation()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const alertStore = useAlertStore()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

const emit = defineEmits([
  'toggleplay',
  'add-follow',
  'add-playlist',
  'download',
  'set-liked',
  'view-artist',
  'go-to-album',
  'dont-play-this',
])

interface Data {
  menuTheme: boolean
}

const props = defineProps<{
  song?: Song | undefined
  artist: Artist
}>()

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const duration = computed<string>(() => {
  if (props.song && props.song.duration !== null) {
    const date = new Date(props.song.duration || 1000)
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${minutes}:${seconds} ${t('gMusicSong.mins')}`
  }

  return ''
})

const allGenres = computed<string>(() => {
  let genres = props.song?.genres || []

  return genres
    .map((genre) => {
      return genre?.name
    })
    .join(', ')
})

const setShare = () => {
  copyToClipboard(`${import.meta.env.VITE_API_URL}${route.path}`)
    .then(() => {
      alertStore.success(t('gMusicGenericArtist.successClipboard'))
    })
    .catch(() => {
      alertStore.error(t('gMusicGenericArtist.errorClipboard'))
    })
}

const setLiked = () => {
  emit('set-liked', true, {
    ids: [props.song?._id],
    is_add_to_liked: !props.song?.is_liked,
  })
}

const onAudioToggle = () => {
  emit('toggleplay', { song: props.song, index: playerStore.getMusicIndex })
}

const downloadSong = () => {
  emit('download', props.song?._id, props.song?.name)
}

const viewArtist = () => {
  emit('view-artist', props.artist._id)
}

const goToAlbum = () => {
  emit('go-to-album', props.song?.albums?.at(0))
}

const addPlayList = () => {
  emit('add-playlist', props.song)
}

const dontPlayThis = () => {
  emit('dont-play-this', props.song)
}
</script>

<template>
  <div class="g-song-info">
    <div class="g-song-info__head">
      <q-avatar
        :size="'200px'"
        class="g-song-info__picture"
        :class="{
          'g-song-info__picture-default': !props.song?.cover_src,
        }"
      >
        <template v-if="props.song?.cover_src">
          <img :alt="props.song.name" :src="props.song?.cover_src" />
        </template>
      </q-avatar>

      <h3 class="g-song-info__title">
        {{ props.song?.name || 'Unknown' }}
      </h3>

      <div class="g-song-info__artist-name">
        <span>{{ props.artist.name || 'Untitled' }}</span>

        <span v-if="allGenres.length">, {{ allGenres }} </span>
      </div>

      <div class="g-song-info__info">
        <span>Songs</span>
        <span v-if="duration">{{ duration }}</span>
        <span v-else>
          <q-skeleton animation="fade" style="width: 100px" />
        </span>
      </div>
    </div>

    <div class="g-song-info__main">
      <div class="g-song-info__actions">
        <DynamicIcon
          v-if="authStore.user"
          :size="24"
          name="heart"
          :class="{ active: !!props.song?.is_liked }"
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
          @click.prevent="downloadSong"
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
                  {{ t('gMusicSong.dontPlayThis') }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click.prevent="viewArtist">
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="artist" />
                </q-item-section>

                <q-item-section>
                  {{ t('gMusicSong.viewArtist') }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click.prevent="goToAlbum">
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

      <div class="g-song-info__side-actions">
        <q-btn
          :label="'Play'"
          class="q-btn-play q-btn-medium icon-left"
          rounded
          text-color="''"
          unelevated
          @click.prevent="onAudioToggle"
        >
          <DynamicIcon
            v-if="playerStore.playing"
            class="on-left"
            name="pause"
          />
          <DynamicIcon v-else class="on-left" name="play" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
