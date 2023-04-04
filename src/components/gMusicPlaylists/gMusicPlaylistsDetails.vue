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

const infoLength = computed<boolean>(() => {
  return props.song?.info ? props.song?.info?.length > 0 : false
})

const allGenres = computed<string>(() => {
  let genres = props.song?.genres || []

  return genres
    .map((genre) => {
      return genre.name
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
  emit('download', props.song?.url, props.song?.name)
}

const addPlayList = () => {
  emit('add-playlist', props.song)
}

const dontPlayThis = () => {
  emit('dont-play-this', props.song)
}
</script>

<template>
  <div class="g-music-playlists-details">
    <div class="g-music-playlists-details__head">
      <q-avatar
        :size="'200px'"
        class="g-music-playlists-details__picture"
        :class="{
          'g-music-playlists-details__picture-default': !props.song?.imageUrl,
        }"
      >
        <template v-if="props.song?.imageUrl">
          <img :alt="props.song.name" :src="props.song?.imageUrl" />
        </template>
      </q-avatar>

      <h3 class="g-music-playlists-details__title">
        {{ props.song?.name || 'Unknown' }}
      </h3>

      <div class="g-music-playlists-details__artist-name">
        <span>{{ props.artist.name || 'Untitled' }}</span>

        <span v-if="allGenres.length">, {{ allGenres }} </span>
      </div>

      <div v-if="infoLength" class="g-music-playlists-details__info">
        <span v-for="(item, index) in props.song?.info" :key="index">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="g-music-playlists-details__main">
      <div class="g-music-playlists-details__actions">
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

      <div class="g-music-playlists-details__side-actions">
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
