<script lang="ts" setup>
import { computed, defineComponent, reactive } from 'vue'
import { Artist } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import { useAlertStore, useAuthStore, useUsersStore } from '@/stores'
import { declensionOfWord } from '@/utils/utils'
import { useTranslation } from '@/composables/lang'
import { copyToClipboard } from 'quasar'

const { t } = useTranslation()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

const emit = defineEmits([
  'add-playlist',
  'download',
  'remove-library',
  'view-artist',
])

const props = defineProps<{
  singer: Artist
}>()

interface Data {
  menuTheme: boolean
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const songsLength = computed<boolean>(() => {
  return props.singer?.song ? props.singer?.song?.length > 0 : false
})

const addPlayList = () => {
  emit('add-playlist', props.singer)
}

const downloadSong = () => {
  emit('download', props.singer.name)
}

const removeLibrary = () => {
  emit('remove-library', props.singer)
}

const viewArtist = () => {
  emit('view-artist', props.singer?._id)
}

const setShare = () => {
  copyToClipboard(`${import.meta.env.VITE_API_URL}/artist/${props.singer?._id}`)
    .then(() => {
      alertStore.success(t('gMusicSingersItem.successClipboard'))
    })
    .catch(() => {
      alertStore.error(t('gMusicSingersItem.errorClipboard'))
    })
}
</script>

<template>
  <div class="g-music-singers-item">
    <div class="g-music-singers-item__content">
      <div
        class="g-music-singers-item__picture"
        :class="{
          'g-music-singers-item__picture-default': !props.singer?.imageUrl,
        }"
      >
        <img
          v-if="props.singer?.imageUrl"
          :alt="props.singer.name"
          :src="props.singer?.imageUrl"
        />
      </div>

      <div class="g-music-singers-item__title">
        <div class="g-music-singers-item__title-top">
          <router-link :to="`/artist/${props.singer?._id}`">
            {{ props.singer?.name || 'Untitled' }}
          </router-link>
          <DynamicIcon
            v-if="props.singer?.is_verified"
            name="verified"
            :size="20"
          />
        </div>

        <div v-if="songsLength" class="g-music-singers-item__title-description">
          {{ props.singer?.song?.length }}
          {{
            declensionOfWord(props.singer?.song?.length, [
              t('gMusicSingersItem.song'),
              t('gMusicSingersItem.songs'),
            ])
          }}
        </div>
      </div>
    </div>

    <div class="g-music-singers-item__action">
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
              v-if="authStore.user"
              v-close-popup
              clickable
              @click.prevent="addPlayList"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="add_playlist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSingersItem.addToPlaylist') }}
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
                {{ t('gMusicSingersItem.download') }}
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
                {{ t('gMusicSingersItem.removeFromLibrary') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click.prevent="viewArtist">
              <q-item-section avatar>
                <DynamicIcon :size="20" name="artist" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSingersItem.viewArtist') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click.prevent="setShare">
              <q-item-section avatar>
                <DynamicIcon :size="20" name="share" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicSingersItem.share') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </i>
    </div>
  </div>
</template>

<style scoped></style>
