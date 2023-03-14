<script lang="ts" setup>
import { defineComponent, reactive } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { useTranslation } from '@/composables/lang'
import { Song } from '@/types/artist'
import { useUsersStore } from '@/stores'
const { t } = useTranslation()
const usersStore = useUsersStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
  },
})

const props = defineProps<{
  album: Song
  artist?: string
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
      label: t('gMusicAlbum.shufflePlay'),
      icon: 'shuffle',
    },
    {
      label: t('gMusicAlbum.addToPlaylist'),
      icon: 'add_playlist',
    },
    {
      label: t('gMusicAlbum.download'),
      icon: 'download_song',
    },
    {
      label: t('gMusicAlbum.removeFromLibrary'),
      icon: 'remove',
    },
    {
      label: t('gMusicAlbum.viewArtist'),
      icon: 'artist',
    },
    {
      label: t('gMusicAlbum.share'),
      icon: 'share',
    },
  ],
})
</script>

<template>
  <router-link :to="props.album.code" class="g-music-album">
    <div class="g-music-album__content">
      <div v-if="props.album.position" class="g-music-album__position">
        {{ props.album.position }}
      </div>
      <div
        class="g-music-album__picture"
        :class="{ 'g-music-album__picture-default': !props.album?.imageUrl }"
      >
        <img
          v-if="props.album?.imageUrl"
          :alt="props.album.name"
          :src="props.album?.imageUrl"
        />
      </div>

      <div class="g-music-album__title">
        <div class="g-music-album__title-top">
          <span>{{ props.album.name || 'Untitled' }}</span>

          <DynamicIcon v-if="props.album.is_verified" name="verified" />
        </div>

        <div
          v-if="props.artist || props.album.issueYear"
          class="g-music-album__title-description"
        >
          <span v-if="props.artist">{{ props.artist }}</span>
          <span>{{ props.album.issueYear }}</span>
        </div>
      </div>
    </div>

    <div class="g-music-album__action">
      <g-play-btn :playing="false" />
      <i class="g-icon g-icon-dots" @click.prevent.stop="">
        <span></span>

        <q-menu
          class="popover-menu album"
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
  </router-link>
</template>

<style scoped></style>
