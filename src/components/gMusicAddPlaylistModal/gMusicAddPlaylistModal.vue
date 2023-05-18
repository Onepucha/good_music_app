<script setup lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
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

const emit = defineEmits([
  'add-playlist-song',
  'close-modal',
  'close-modal-create',
])

const props = defineProps<{
  song?: Song | undefined
  dialog: boolean
  playlistAdd?: Playlists | undefined
}>()

interface Data {
  playlists: Array<Playlists>
  playlist: Playlists | undefined
  page: number
  playlistsCount: number
  isLoading: boolean
}

const data: Data = reactive({
  playlists: [],
  playlist: undefined,
  page: 0,
  playlistsCount: 24,
  isLoading: false,
})

watch(
  () => props.playlistAdd,
  () => {
    nextTick(async () => {
      data.page = 0
      await getLikedYourPlaylists()
    })
  }
)

const dialogAddModal = ref<boolean>(props.dialog)
const dialogRemoveModal = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const qDialogPopupTwo = ref<any>(null)
const position = ref<any>('bottom')
const isLoading = ref<boolean>(false)
const scrollTargetRef = ref<any>(document.createElement('div'))

const addPlaylistItem = ref({
  _id: 1,
  icon: 'plus',
  name: 'Add New Playlist',
})

const getLikedYourPlaylists = async () => {
  try {
    data.page++
    const response: any = await PlaylistsApi.getLikedYour({
      count: data.playlistsCount,
      page: data.page,
    })

    data.playlists = data.playlists.concat(response.data.playlists)
  } catch (error: unknown) {
    console.error(error)
    emit('close-modal', false)
  }
}

const addPlaylist = (playlist: Playlists) => {
  emit('add-playlist-song', playlist)
}

const removePlaylist = (playlist: Playlists) => {
  data.playlist = playlist
  dialogRemoveModal.value = true
}

const confirmRemovePlaylist = async (playlist: Playlists) => {
  try {
    if (data.playlist?._id) {
      await PlaylistsApi.removePlaylist(data.playlist._id)

      const indexToDelete = data.playlists.findIndex(
        (item) => item._id === data.playlist?._id
      )

      if (indexToDelete !== -1) {
        data.playlists.splice(indexToDelete, 1)
      }

      dialogRemoveModal.value = false
      dialogAddModal.value = false
      emit('close-modal-create', false)
    }
  } catch (error: unknown) {
    console.error(error)
  }
}

const openAddPlaylist = () => {
  emit('close-modal', true, true)
}

const closeModalAdd = () => {
  dialogAddModal.value = false
  dialogRemoveModal.value = false
  emit('close-modal-create', false)
}

onMounted(async () => {
  await getLikedYourPlaylists()
})
</script>

<template>
  <div>
    <q-dialog
      :key="'qDialogPopup'"
      ref="qDialogPopup"
      v-model="dialogAddModal"
      :position="position"
      class="g-music-add-playlist-modal"
      @update:model-value="closeModalAdd"
    >
      <q-card>
        <q-card-section class="g-music-add-playlist-modal__body text-center">
          <h4>{{ t('gMusicAddPlaylistModal.popup.title') }}</h4>

          <q-list ref="scrollTargetRef" class="scroll">
            <g-music-playlist-item
              :item="addPlaylistItem"
              @add-playlist="openAddPlaylist"
            />

            <g-music-playlist-item
              v-for="(item, index) in data.playlists"
              :key="index"
              :item="item"
              :song="props.song"
              has-add-playlist
              @add-playlist="addPlaylist"
              @remove-playlist="removePlaylist"
            />
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      :key="'qDialogPopupTwo'"
      ref="qDialogPopupTwo"
      v-model="dialogRemoveModal"
      :position="position"
      class="g-popup-profile"
      @update:model-value="closeModalAdd"
    >
      <q-card>
        <q-card-section class="g-popup-profile__body text-center">
          <h4>{{ t('pages.library.playlists.popup.title') }}</h4>
          <h5>
            {{ t('pages.library.playlists.popup.description') }}
          </h5>
          <div class="g-popup-profile__action">
            <q-btn
              v-close-popup
              :label="t('pages.library.playlists.popup.buttonCancel')"
              class="g-popup-profile__btn q-btn--light-primary q-btn-large"
              rounded
              text-color="''"
              unelevated
            />

            <q-btn
              :label="t('pages.library.playlists.popup.buttonConfirm')"
              class="g-popup-profile__btn q-btn-large"
              rounded
              text-color="''"
              unelevated
              @click.prevent="confirmRemovePlaylist"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped></style>
