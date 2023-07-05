<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useTranslation } from '@/composables/lang'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores'
import { declensionOfWord } from '@/utils/utils'
import { Playlists, Song } from '@/types/artist'
import { copyToClipboard } from 'quasar'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useTranslation()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const usersStore = useUsersStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

const props = defineProps<{
  playlist?: Playlists
  song?: Song
}>()

interface Data {
  menuTheme: boolean
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const emit = defineEmits([
  'set-liked',
  'download',
  'share',
  'shuffle',
  'toggleplay',
  'remove-playlist',
])

const isLoading = ref<boolean>(false)

const songsLength = computed<boolean>(() => {
  return props.playlist?.songs ? props.playlist?.songs?.length > 0 : false
})

const playOrPauseBtnLabel = computed<string>(() => {
  return playerStore.playing ? t('pause') : t('play')
})

const imagePlaylist = computed<string>(() => {
  if (!props.playlist?.cover_src && !props.song?.cover_src) {
    return ''
  } else {
    return props.playlist?.cover_src || props.song?.cover_src || ''
  }
})

const onAudioToggle = (song: Song, id: number | string, index: number) => {
  emit('toggleplay', { song, id, index })
}

const onShuffle = () => {
  emit('shuffle')
}

const setLiked = () => {
  emit('set-liked', true, {
    ids: [props.playlist?._id],
    is_add_to_liked: !props.playlist?.is_liked,
  })
}

const downloadSong = () => {
  emit('download', props.playlist?._id, props.playlist?.name)
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

const removePlaylist = () => {
  emit('remove-playlist', props.playlist)
}
</script>

<template>
  <div class="g-playlist-header">
    <div class="g-playlist-header__wrap">
      <div class="g-playlist-header__aside">
        <div
          class="g-playlist-header__aside-picture"
          :class="{
            'g-playlist-header__aside-picture-default': !imagePlaylist,
          }"
        >
          <img
            v-if="imagePlaylist"
            :alt="props.playlist.name"
            :src="imagePlaylist"
          />
        </div>
      </div>
      <div class="g-playlist-header__main">
        <div class="g-playlist-header__main-top">
          <div class="g-playlist-header__info">
            <div class="g-playlist-header__info-title">
              {{ props.playlist?.name || 'Untitled' }}
            </div>

            <div class="g-playlist-header__info-description">
              <span>{{ t('gPlaylistHeader.playlist') }}</span>
              <span v-if="songsLength">
                {{ props.playlist?.songs?.length }}
                {{
                  declensionOfWord(props.playlist?.songs?.length, [
                    t('gPlaylistHeader.song'),
                    t('gPlaylistHeader.songs'),
                  ])
                }}
              </span>
            </div>
          </div>
        </div>

        <div class="g-playlist-header__main-bottom">
          <div class="g-playlist-header__main-actions">
            <DynamicIcon
              :size="24"
              name="check_like"
              @click.prevent="setLiked"
            />

            <DynamicIcon
              :size="24"
              name="download_song"
              @click.prevent="downloadSong"
            />

            <DynamicIcon :size="24" name="share" @click.prevent="setShare" />

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
                    @click.prevent="removePlaylist"
                  >
                    <q-item-section avatar>
                      <DynamicIcon :size="20" name="remove" />
                    </q-item-section>

                    <q-item-section>
                      {{ t('gPlaylistHeader.removePlaylist') }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </i>
          </div>
        </div>
      </div>
    </div>

    <div v-if="playlist?.songs?.length" class="g-playlist-header__actions">
      <q-btn
        :label="t('gPlaylistHeader.buttonShuffle')"
        :loading="isLoading"
        class="q-btn-shuffle q-btn-large full-width icon-left"
        rounded
        text-color="''"
        unelevated
        @click.prevent="onShuffle"
      >
        <DynamicIcon :size="20" class="on-left" name="shuffle" />
      </q-btn>

      <q-btn
        :label="playOrPauseBtnLabel"
        class="q-btn-play q-btn--light-primary q-btn-large full-width icon-left"
        rounded
        text-color="''"
        unelevated
        @click.prevent="onAudioToggle(props.song, playerStore.getMusicIndex, 0)"
      >
        <DynamicIcon
          v-if="playerStore.playing"
          class="on-left"
          name="pause_over"
          :size="20"
        />
        <DynamicIcon v-else class="on-left" name="play_over" :size="20" />
      </q-btn>
    </div>
  </div>
</template>

<style scoped></style>
