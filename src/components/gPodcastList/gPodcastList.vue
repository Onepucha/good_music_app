<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { defineComponent, reactive } from 'vue'
import { useTranslation } from '@/composables/lang'
import { useUsersStore } from '@/stores'
const { t } = useTranslation()
const usersStore = useUsersStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
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

const emit = defineEmits(['like', 'add-playlist', 'download', 'toggleplay'])
</script>

<template>
  <div class="g-podcast-list">
    <div class="g-podcast-list__aside">
      <div
        class="g-podcast-list__aside-picture"
        :class="{ 'g-podcast-list__aside-picture-default': !podcast?.imageUrl }"
      >
        <img
          v-if="podcast?.imageUrl"
          :alt="podcast.name"
          :src="podcast?.imageUrl"
        />
      </div>
    </div>
    <div class="g-podcast-list__main">
      <div class="g-podcast-list__main-top">
        <div class="g-podcast-list__info">
          <div class="g-podcast-list__info-title">
            {{ podcast?.title || 'Untitled' }}
          </div>

          <div class="g-podcast-list__info-description">
            <span>{{ podcast?.author || 'Unknown' }}</span>
            <span>{{ podcast?.duration || 'Unknown' }}</span>
          </div>
        </div>
      </div>

      <div class="g-podcast-list__main-bottom">
        <div class="g-podcast-list__main-actions">
          <DynamicIcon :size="20" name="heart" @click.prevent="$emit('like')" />

          <DynamicIcon
            :size="20"
            name="add_playlist"
            @click.prevent="$emit('add-playlist')"
          />

          <DynamicIcon
            :size="20"
            name="download_song"
            @click.prevent="$emit('download')"
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

        <div class="g-podcast-list__main-side-actions">
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
