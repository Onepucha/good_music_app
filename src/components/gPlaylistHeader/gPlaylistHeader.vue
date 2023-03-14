<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import { defineComponent, reactive, ref } from 'vue'
import { useTranslation } from '@/composables/lang'
import { useUsersStore } from '@/stores'

const { t } = useTranslation()
const usersStore = useUsersStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

interface Podcast {
  id: string | number
  imageUrl: string
  title: string
  name: string
  author: string
  duration: string
}

const props = defineProps<{
  podcast?: Podcast
  playing: boolean
}>()

interface Menu {
  label: string
  icon: string
}

interface Data {
  menuTheme: boolean
  menu: Menu[]
}

const emit = defineEmits(['like', 'download', 'share', 'shuffle', 'toggleplay'])

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
</script>

<template>
  <div class="g-playlist-header">
    <div class="g-playlist-header__wrap">
      <div class="g-playlist-header__aside">
        <div
          class="g-playlist-header__aside-picture"
          :class="{
            'g-playlist-header__aside-picture-default':
              !props.podcast?.imageUrl,
          }"
        >
          <img
            v-if="props.podcast?.imageUrl"
            :alt="props.podcast.name"
            :src="props.podcast?.imageUrl"
          />
        </div>
      </div>
      <div class="g-playlist-header__main">
        <div class="g-playlist-header__main-top">
          <div class="g-playlist-header__info">
            <div class="g-playlist-header__info-title">
              {{ props.podcast?.title || 'Untitled' }}
            </div>

            <div class="g-playlist-header__info-description">
              <span>{{ props.podcast?.author || 'Unknown' }}</span>
              <span>{{ props.podcast?.duration || 'Unknown' }}</span>
            </div>
          </div>
        </div>

        <div class="g-playlist-header__main-bottom">
          <div class="g-playlist-header__main-actions">
            <DynamicIcon
              :size="24"
              name="check_like"
              @click.prevent="$emit('like')"
            />

            <DynamicIcon
              :size="24"
              name="download_song"
              @click.prevent="$emit('download')"
            />

            <DynamicIcon
              :size="24"
              name="share"
              @click.prevent="$emit('share')"
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

    <div class="g-playlist-header__actions">
      <q-btn
        :label="t('gPlaylistHeader.buttonShuffle')"
        :loading="isLoading"
        class="q-btn-large icon-left"
        rounded
        text-color="''"
        unelevated
        @click.prevent="$emit('download')"
      >
        <DynamicIcon :size="20" class="on-left" name="shuffle" />
      </q-btn>

      <q-btn
        v-close-popup
        :label="t('gPlaylistHeader.buttonPlay')"
        class="q-btn--light-primary q-btn-large icon-left"
        rounded
        text-color="''"
        unelevated
        @click.prevent="$emit('toggleplay')"
      >
        <DynamicIcon :size="20" class="on-left" name="play_round" />
      </q-btn>
    </div>
  </div>
</template>

<style scoped></style>
