<script setup lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useTranslation } from '@/composables/lang'
import { useAuthStore } from '@/stores'
import PlaylistsApi from '@/services/playlists'
import { Playlists, Song } from '@/types/artist'

import gMusicPlaylistItem from '@/components/gMusicPlaylists/gMusicPlaylistItem.vue'

defineComponent({
  components: {
    gMusicPlaylistItem,
  },
})

const { t } = useTranslation()
const authStore = useAuthStore()

const emit = defineEmits(['add-playlist-song', 'close-modal'])

const props = defineProps<{
  song?: Song | undefined
}>()

interface Data {
  playlists: Array<Playlists>
  page: number
  playlistsCount: number
  isLoading: boolean
}

const data: Data = reactive({
  playlists: [],
  page: 0,
  playlistsCount: 24,
  isLoading: false,
})

const dialog = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')
const isLoading = ref<boolean>(false)
const scrollTargetRef = ref<any>(document.createElement('div'))

const hasAddTrack = computed<boolean>(() => {
  let trackId: any = props.song?._id

  return data.playlists.some((track) => track.songs.includes(trackId as string))
})

const getLikedYourPlaylists = async () => {
  try {
    data.page++
    const response: any = await PlaylistsApi.getLikedYour({
      count: data.playlistsCount,
      page: data.page,
    })

    if (response.data.playlists.length === 0) {
      emit('close-modal', false, true)
    }

    data.playlists = data.playlists.concat(response.data.playlists)
  } catch (error: unknown) {
    console.error(error)
    emit('close-modal', false)
  }
}

const addPlaylist = (playlist: Playlists) => {
  emit('add-playlist-song', playlist)
}

onMounted(async () => {
  await getLikedYourPlaylists()
})
</script>

<template>
  <q-dialog
    ref="qDialogPopup"
    v-model="dialog"
    :position="position"
    class="g-music-add-playlist-modal"
  >
    <q-card>
      <q-card-section class="g-music-add-playlist-modal__body text-center">
        <h4>{{ t('gMusicAddPlaylistModal.popup.title') }}</h4>

        <q-list
          ref="scrollTargetRef"
          class="scroll"
          style="max-height: 250px; overflow: auto"
        >
          <g-music-playlist-item
            v-for="(playlist, index) in data.playlists"
            :key="index"
            :item="playlist"
            has-add-playlist
            @add-playlist="addPlaylist"
          />
          <!--            :has-add-track="hasAddTrack"-->
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
