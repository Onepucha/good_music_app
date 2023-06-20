<script lang="ts" setup>
import { computed, defineComponent, reactive } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import { useTranslation } from '@/composables/lang'
import { Album, Artist } from '@/types/artist'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores'
import { copyToClipboard } from 'quasar'

const { t } = useTranslation()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

const props = defineProps<{
  album: Album
}>()

interface Data {
  menuTheme: boolean
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const findArtist = computed<Artist | undefined>(() => {
  return props.album?.artists?.at(0)
})

const emit = defineEmits([
  'shuffle-play',
  'add-playlist',
  'download',
  'remove-library',
  'view-artist',
])

const shufflePlay = () => {
  emit('shuffle-play', props.album?.songs, findArtist.value)
}

const addPlayList = () => {
  emit('add-playlist', props.album)
}

const downloadSong = () => {
  emit('download', props.album._id)
}

const removeLibrary = () => {
  emit('remove-library', props.album)
}

const viewArtist = () => {
  emit('view-artist', props.album?.artists?.at(0)?._id)
}

const setShare = () => {
  copyToClipboard(`${import.meta.env.VITE_API_URL}/album/${props.album._id}`)
    .then(() => {
      alertStore.success(t('gMusicGenericArtist.successClipboard'))
    })
    .catch(() => {
      alertStore.error(t('gMusicGenericArtist.errorClipboard'))
    })
}
</script>

<template>
  <div class="g-music-album">
    <div class="g-music-album__content">
      <div v-if="props.album.position" class="g-music-album__position">
        {{ props.album.position }}
      </div>
      <div
        class="g-music-album__picture"
        :class="{ 'g-music-album__picture-default': !props.album?.cover_src }"
      >
        <img
          v-if="props.album?.cover_src"
          :alt="props.album.name"
          :src="props.album?.cover_src"
        />
      </div>

      <div class="g-music-album__title">
        <div class="g-music-album__title-top">
          <router-link :to="`/album/${props.album._id}`"
            >{{ props.album.name || 'Untitled' }}
          </router-link>

          <DynamicIcon
            v-if="props.album.is_verified"
            name="verified"
            :size="20"
          />
        </div>

        <div v-if="findArtist" class="g-music-album__title-description">
          <router-link v-if="findArtist?.name" :to="`/artist/${findArtist._id}`"
            >{{ findArtist.name }}
          </router-link>
          <span v-if="findArtist?.issueYear">{{ findArtist.issueYear }}</span>
        </div>
      </div>
    </div>

    <div class="g-music-album__action">
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
              v-if="authStore.user && props.album?.songs.length"
              v-close-popup
              clickable
              @click.prevent="shufflePlay"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="shuffle" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicAlbum.shufflePlay') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="authStore.user"
              v-close-popup
              clickable
              @click.prevent="addPlayList"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="add_playlist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicAlbum.addToPlaylist') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="authStore.user && props.album?.songs.length"
              v-close-popup
              clickable
              @click.prevent="downloadSong"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="download_song" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicAlbum.download') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="authStore.user"
              v-close-popup
              clickable
              @click.prevent="removeLibrary"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="remove" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicAlbum.removeFromLibrary') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click.prevent="viewArtist">
              <q-item-section avatar>
                <DynamicIcon :size="20" name="artist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicAlbum.viewArtist') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click.prevent="setShare">
              <q-item-section avatar>
                <DynamicIcon :size="20" name="share" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicAlbum.share') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </i>
    </div>
  </div>
</template>

<style scoped></style>
