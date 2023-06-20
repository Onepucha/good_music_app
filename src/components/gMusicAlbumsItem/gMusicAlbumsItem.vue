<script lang="ts" setup>
import { computed, defineComponent, reactive } from 'vue'
import { Album } from '@/types/artist'

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
  album: Album
}>()

interface Data {
  menuTheme: boolean
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const episodesLength = computed<boolean>(() => {
  return props.album?.songs ? props.album?.songs?.length > 0 : false
})

const addPlayList = () => {
  emit('add-playlist', props.album)
}

const downloadSong = () => {
  emit('download', props.album._id)
}

const removeLibrary = () => {
  emit('remove-library', props.album)
}

const setShare = () => {
  copyToClipboard(`${import.meta.env.VITE_API_URL}/album/${props.album?._id}`)
    .then(() => {
      alertStore.success(t('gMusicSingersItem.successClipboard'))
    })
    .catch(() => {
      alertStore.error(t('gMusicSingersItem.errorClipboard'))
    })
}
</script>

<template>
  <div class="g-music-albums-item">
    <div class="g-music-albums-item__content">
      <div
        class="g-music-albums-item__picture"
        :class="{
          'g-music-albums-item__picture-default': !props.album?.imageUrl,
        }"
      >
        <img
          v-if="props.album?.imageUrl"
          :alt="props.album.name"
          :src="props.album?.imageUrl"
        />
      </div>

      <div class="g-music-albums-item__title">
        <div class="g-music-albums-item__title-top">
          <router-link :to="`/album/${props.album?._id}`">
            {{ props.album?.name || 'Untitled' }}
          </router-link>
        </div>

        <div class="g-music-albums-item__title-description">
          <div
            v-if="episodesLength"
            class="g-music-albums-item__title-description"
          >
            {{ props.album?.songs?.length }}
            {{
              declensionOfWord(props.album?.songs?.length, [
                t('gMusicAlbumsItem.episode'),
                t('gMusicAlbumsItem.episodes'),
              ])
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="g-music-albums-item__action">
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
                {{ t('gMusicAlbumsItem.addToPlaylist') }}
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
                {{ t('gMusicAlbumsItem.download') }}
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
                {{ t('gMusicAlbumsItem.removeFromLibrary') }}
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click.prevent="setShare">
              <q-item-section avatar>
                <DynamicIcon :size="20" name="share" />
              </q-item-section>

              <q-item-section>
                {{ t('gMusicAlbumsItem.share') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </i>
    </div>
  </div>
</template>

<style scoped></style>
