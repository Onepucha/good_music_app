<script lang="ts" setup>
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { useTranslation } from '@/composables/lang'
import { RouteLocationRaw } from 'vue-router'
import { usePlayerStore, useUsersStore } from '@/stores/'

const { t } = useTranslation()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
  },
})

const props = defineProps<{
  song?: Song | undefined
  artist?: string
  artistId?: RouteLocationRaw
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

const emit = defineEmits(['toggleplay'])

const onAudioToggle = () => {
  emit('toggleplay', props.song)
}
</script>

<template>
  <div class="g-music-song">
    <div class="g-music-song__content">
      <div
        class="g-music-song__picture"
        :class="{ 'g-music-song__picture-default': !props.song?.imageUrl }"
      >
        <img
          v-if="props.song?.imageUrl"
          :alt="props.song.name"
          :src="props.song?.imageUrl"
        />
      </div>

      <div class="g-music-song__title">
        <div class="g-music-song__title-top">
          <router-link
            :to="`/artist/${props.artistId}/track/${props.song?._id}`"
          >
            {{ props.song?.name || 'Untitled' }}
          </router-link>
        </div>

        <router-link
          v-if="props.artistId"
          :to="`/artist/${props.artistId}`"
          class="g-music-song__title-description"
        >
          {{ props.artist || 'Unknown' }}
        </router-link>
      </div>
    </div>

    <div class="g-music-song__action">
      <g-play-btn
        :playing="
          playerStore.playing && playerStore.musicId === props.song?._id
        "
        @click.prevent="onAudioToggle"
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
</template>

<style scoped></style>
