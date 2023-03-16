<script setup lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { Artist, Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { useTranslation } from '@/composables/lang'
import { useAuthStore, usePlayerStore, useUsersStore } from '@/stores'

const { t } = useTranslation()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
  },
})

interface Menu {
  label: string
  icon: string
}

interface Data {
  menuTheme: boolean
  menu: Menu[]
}

const props = defineProps<{
  artist?: Artist | undefined
  song?: Song | undefined
  songs?: Array<Song> | undefined
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

const { user }: any = useAuthStore()

const findFollowArtist = computed<boolean>(() => {
  return user?.artists.includes(props.artist?._id)
})

const follow = ref<boolean>(findFollowArtist.value || false)

const followBtnText = computed<string>(() => {
  return follow.value ? 'Following' : 'Follow'
})

const followBtnClass = computed<string>(() => {
  return follow.value ? 'q-btn-border' : ''
})

const emit = defineEmits(['add-follow', 'toggleplay'])

const toggleFollow = (artist: Artist | undefined) => {
  follow.value = !follow.value
  emit('add-follow', { follow: follow.value, artist })
}

const onAudioToggle = () => {
  emit('toggleplay', { song: props.song, index: playerStore.getMusicIndex })
}
</script>

<template>
  <div class="g-music-generic-artist">
    <div class="g-music-generic-artist__head">
      <q-avatar
        :size="'200px'"
        class="g-music-generic-artist__picture"
        :class="{
          'g-music-generic-artist__picture-default': !props.artist?.imageUrl,
        }"
      >
        <template v-if="props.artist?.imageUrl">
          <img :alt="props.artist?.name" :src="props.artist?.imageUrl" />
        </template>
      </q-avatar>

      <h3 class="g-music-generic-artist__title">
        {{ props.artist?.name }}
      </h3>

      <div
        v-if="props.artist?.monthlyListeners"
        class="g-music-generic-artist__info"
      >
        <div class="g-music-generic-artist__info-description">
          {{ props.artist?.monthlyListeners }}
          {{ t('pages.artist.monthlyListeners') }}
        </div>
      </div>
    </div>

    <div class="g-music-generic-artist__main">
      <div class="g-music-generic-artist__actions">
        <q-btn
          :class="followBtnClass"
          :label="followBtnText"
          class="q-btn-medium"
          rounded
          text-color="''"
          unelevated
          @click.prevent="toggleFollow(props.artist)"
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

      <div class="g-music-generic-artist__side-actions">
        <g-play-btn
          :playing="playerStore.playing"
          @click.prevent="onAudioToggle"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
