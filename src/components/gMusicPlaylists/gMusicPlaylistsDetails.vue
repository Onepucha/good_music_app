<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { Playlists, Song } from '@/types/artist'

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
  playlist?: Playlists | undefined
  song?: Song
}>()

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const infoLength = computed<boolean>(() => {
  return props.playlist?.info ? props.playlist?.info?.length > 0 : false
})

const shouldLikeButton = computed<boolean>(() => {
  const userPlaylists = authStore?.user?.own_playlist
  const currentPlaylistId = props.playlist?._id
  if (!userPlaylists || !currentPlaylistId) {
    return false
  }

  return userPlaylists.some((playlistId) => playlistId === currentPlaylistId)
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
  emit('set-liked', false, {
    ids: [props.playlist?._id],
    is_add_to_liked: !props.playlist?.is_liked,
  })
}

const addPlayList = () => {
  emit('add-playlist', props.song)
}

const onAudioToggle = (song: Song, index: number | string) => {
  emit('toggleplay', { song, index })
}

const downloadSong = () => {
  emit('download', props.playlist?.url, props.playlist?.name)
}

const dontPlayThis = () => {
  emit('dont-play-this', props.playlist)
}
</script>

<template>
  <div class="g-music-playlists-details">
    <div class="g-music-playlists-details__head">
      <q-avatar
        :size="'200px'"
        class="g-music-playlists-details__picture"
        :class="{
          'g-music-playlists-details__picture-default':
            !props.playlist?.imageUrl,
        }"
      >
        <template v-if="props.playlist?.imageUrl">
          <img :alt="props.playlist.name" :src="props.playlist?.imageUrl" />
        </template>
      </q-avatar>

      <h3 class="g-music-playlists-details__title">
        {{ props.playlist?.name || 'Unknown' }}
      </h3>

      <div
        v-if="authStore.user"
        class="g-music-playlists-details__playlist-name"
      >
        <span>{{ authStore.user?.nickname || 'Untitled' }}</span>
      </div>

      <div v-if="infoLength" class="g-music-playlists-details__info">
        <span v-for="(item, index) in props.playlist?.info" :key="index">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="g-music-playlists-details__main">
      <div class="g-music-playlists-details__actions">
        <DynamicIcon
          v-if="!shouldLikeButton"
          :size="24"
          name="heart"
          :class="{ active: !!props.playlist?.is_liked }"
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
                v-if="authStore.user && props.playlist"
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
          @click.prevent="onAudioToggle(props.song, playerStore.getMusicIndex)"
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
