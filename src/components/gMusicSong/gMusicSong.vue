<script lang="ts" setup>
import { computed, defineComponent, reactive, ref } from 'vue'
import { Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import { useTranslation } from '@/composables/lang'
import { RouteLocationRaw } from 'vue-router'
import { useAuthStore, usePlayerStore, useUsersStore } from '@/stores/'

const { t } = useTranslation()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()

defineComponent({
  components: {
    DynamicIcon,
    gPlayBtn,
  },
})

const props = defineProps<{
  song: Song
  artist?: string
  artistId?: RouteLocationRaw
}>()

interface Menu {
  label: string
  icon: string
}

interface Data {
  menuTheme: boolean
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const songLiked = computed<boolean>(() => {
  return authStore.findSongLiked(props.song?._id)
})

const like = ref<boolean>(songLiked.value)

const emit = defineEmits(['toggleplay', 'like'])

const onAudioToggle = () => {
  emit('toggleplay', props.song)
}

const setLiked = () => {
  emit('like', { ids: props.song?._id, is_add_to_liked: !songLiked.value })
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
            <q-item v-close-popup clickable @click.prevent="setLiked">
              <q-item-section avatar>
                <DynamicIcon
                  :class="{ active: songLiked }"
                  :size="20"
                  name="like"
                />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.like') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable>
              <q-item-section avatar>
                <DynamicIcon :size="20" name="add_playlist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.addToPlaylist') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable>
              <q-item-section avatar>
                <DynamicIcon :size="20" name="dont_play" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.dontPlayThis') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable>
              <q-item-section avatar>
                <DynamicIcon :size="20" name="download_song" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.download') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable>
              <q-item-section avatar>
                <DynamicIcon :size="20" name="artist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.viewArtist') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable>
              <q-item-section avatar>
                <DynamicIcon :size="20" name="play_album" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSong.gotoAlbum') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable>
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
  </div>
</template>

<style scoped></style>
