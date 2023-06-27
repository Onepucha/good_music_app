<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { defineComponent, reactive } from 'vue'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, useUsersStore } from '@/stores'
import { copyToClipboard } from 'quasar'
import { useRoute } from 'vue-router'
import { Playlists } from '@/types/artist'

const route = useRoute()
const { t } = useTranslation()
const usersStore = useUsersStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
  },
})

const props = defineProps<{
  playlist?: Playlists
  playing: boolean
}>()

interface Menu {
  _id: string
  label: string
  icon: string
}

interface Data {
  menuTheme: boolean
  menu: Menu[]
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
  menu: [
    {
      _id: '1',
      label: t('gMusicSong.like'),
      icon: 'like',
    },
    {
      _id: '2',
      label: t('gMusicSong.addToPlaylist'),
      icon: 'add_playlist',
    },
    {
      _id: '3',
      label: t('gMusicSong.dontPlayThis'),
      icon: 'dont_play',
    },
    {
      _id: '4',
      label: t('gMusicSong.download'),
      icon: 'download_song',
    },
    {
      _id: '5',
      label: t('gMusicSong.viewArtist'),
      icon: 'artist',
    },
    {
      _id: '6',
      label: t('gMusicSong.gotoAlbum'),
      icon: 'play_album',
    },
    {
      _id: '7',
      label: t('gMusicSong.share'),
      icon: 'share',
    },
  ],
})

const emit = defineEmits([
  'check-like',
  'add-playlist',
  'download',
  'toggleplay',
])

const downloadPlaylist = () => {
  emit('download', props.playlist)
}

const checkLike = () => {
  emit('check-like', props.playlist)
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
  <div class="g-music-playlist-info">
    <div class="g-music-playlist-info__aside">
      <div
        class="g-music-playlist-info__aside-picture"
        :class="{
          'g-music-playlist-info__aside-picture-default': !playlist?.imageUrl,
        }"
      >
        <img
          v-if="playlist?.imageUrl"
          :alt="playlist.name"
          :src="playlist?.imageUrl"
        />
      </div>
    </div>
    <div class="g-music-playlist-info__main">
      <div class="g-music-playlist-info__main-top">
        <div class="g-music-playlist-info__info">
          <div class="g-music-playlist-info__info-title">
            {{ playlist?.title || 'Untitled' }}
          </div>

          <div class="g-music-playlist-info__info-description">
            <span>{{ playlist?.author || 'Unknown' }}</span>
            <span>{{ playlist?.duration || 'Unknown' }}</span>
          </div>
        </div>
      </div>

      <div class="g-music-playlist-info__main-bottom">
        <div class="g-music-playlist-info__main-actions">
          <DynamicIcon
            :size="20"
            name="check_like"
            @click.prevent="checkLike"
          />

          <DynamicIcon
            :size="20"
            name="download_song"
            @click.prevent="downloadPlaylist"
          />

          <DynamicIcon :size="20" name="share" @click.prevent="setShare" />

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
                  v-for="item in data.menu"
                  :key="item._id"
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

        <div class="g-music-playlist-info__main-side-actions">
          <g-play-btn
            :playing="props.playing"
            @click.prevent="$emit('toggleplay')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
