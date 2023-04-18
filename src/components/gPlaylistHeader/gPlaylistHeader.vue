<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, usePlayerStore, useUsersStore } from '@/stores'
import { declensionOfWord } from '@/utils/utils'
import { Playlists, Song } from '@/types/artist'
import { copyToClipboard } from 'quasar'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useTranslation()
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
}>()

interface Menu {
  label: string
  icon: string
}

interface Data {
  menuTheme: boolean
  menu: Menu[]
}

const emit = defineEmits([
  'set-liked',
  'download',
  'share',
  'shuffle',
  'toggleplay',
])

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
  menu: [
    {
      label: t('gMusicSong.like'),
      icon: 'like',
    },
    {
      label: t('gMusicSong.addToPlaylist'),
      icon: 'add_playlist',
    },
    {
      label: t('gMusicSong.dontPlayThis'),
      icon: 'dont_play',
    },
    {
      label: t('gMusicSong.download'),
      icon: 'download_song',
    },
    {
      label: t('gMusicSong.viewArtist'),
      icon: 'artist',
    },
    {
      label: t('gMusicSong.gotoAlbum'),
      icon: 'play_album',
    },
    {
      label: t('gMusicSong.share'),
      icon: 'share',
    },
  ],
})

const isLoading = ref<boolean>(false)

const songsLength = computed<boolean>(() => {
  return props.playlist?.songs ? props.playlist?.songs?.length > 0 : false
})

const playOrPauseBtnLabel = computed<string>(() => {
  return playerStore.playing ? t('pause') : t('play')
})

const onAudioToggle = (song: Song, index: number | string) => {
  emit('toggleplay', { song, index })
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
  emit('download', props.playlist?.url, props.playlist?.name)
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
</script>

<template>
  <div class="g-playlist-header">
    <div class="g-playlist-header__wrap">
      <div class="g-playlist-header__aside">
        <div
          class="g-playlist-header__aside-picture"
          :class="{
            'g-playlist-header__aside-picture-default':
              !props.playlist?.imageUrl,
          }"
        >
          <img
            v-if="props.playlist?.imageUrl"
            :alt="props.playlist.name"
            :src="props.playlist?.imageUrl"
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
                    v-for="(item, index) in data.menu"
                    :key="index"
                    v-close-popup
                    clickable
                  >
                    <q-item-section avatar>
                      <DynamicIcon :size="20" :name="item.icon" />
                    </q-item-section>

                    <q-item-section>
                      {{ item.label }}
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
        @click.prevent="onAudioToggle(props.song, playerStore.getMusicIndex)"
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
