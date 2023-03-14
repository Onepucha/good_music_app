<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import { useTranslation } from '@/composables/lang'
import { useUsersStore } from '@/stores'

const { t } = useTranslation()
const usersStore = useUsersStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

const emit = defineEmits([
  'toggleplay',
  'add-follow',
  'like',
  'add-playlist',
  'download',
])

interface Menu {
  label: string
  icon: string
}

interface Data {
  menuTheme: boolean
  menu: Menu[]
}

const props = defineProps<{
  song?: Song | undefined
  artist?: string
}>()

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
</script>

<template>
  <div class="g-song-info">
    <div class="g-song-info__head">
      <q-avatar
        :size="'200px'"
        class="g-song-info__picture"
        :class="{
          'g-song-info__picture-default': !props.song?.imageUrl,
        }"
      >
        <template v-if="props.song?.imageUrl">
          <img :alt="props.song.name" :src="props.song?.imageUrl" />
        </template>
      </q-avatar>

      <h3 class="g-song-info__title">
        {{ props.song?.name || 'Unknown' }}
      </h3>

      <div class="g-song-info__artist-name">
        <span>{{ props.artist || 'Untitled' }}</span>

        <span v-if="allGenres.length">, {{ allGenres }} </span>
      </div>

      <div v-if="infoLength" class="g-song-info__info">
        <span v-for="(item, index) in props.song?.info" :key="index">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="g-song-info__main">
      <div class="g-song-info__actions">
        <DynamicIcon :size="24" name="heart" @click.prevent="emit('like')" />

        <DynamicIcon
          :size="24"
          name="add_playlist"
          @click.prevent="emit('add-playlist')"
        />

        <DynamicIcon
          :size="24"
          name="download_song"
          @click.prevent="emit('download')"
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

      <div class="g-song-info__side-actions">
        <q-btn
          :label="'Play'"
          class="q-btn-play q-btn-medium icon-left"
          rounded
          text-color="''"
          unelevated
          @click.prevent="emit('toggleplay')"
        >
          <DynamicIcon class="on-left" name="play" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
