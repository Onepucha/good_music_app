<script setup lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import gMusicAddPlaylistModal from '@/components/gMusicAddPlaylistModal/gMusicAddPlaylistModal.vue'
import gMusicCreatePlaylistModal from '@/components/gMusicCreatePlaylistModal/gMusicCreatePlaylistModal.vue'
import { useTranslation } from '@/composables/lang'
import { useAuthStore } from '@/stores'
import { Playlists, Song } from '@/types/artist'

defineComponent({
  components: {
    gMusicAddPlaylistModal,
    gMusicCreatePlaylistModal,
  },
})

const { t } = useTranslation()
const authStore = useAuthStore()

const props = defineProps<{
  dialog: boolean
  song?: Song | undefined
}>()

interface Data {
  isLoading: boolean
}

const data: Data = reactive({
  isLoading: false,
})

const emit = defineEmits([
  'add-playlist-song',
  'close-modal',
  'close-modal-create',
])

const dialogAddModal = ref<boolean>(props.dialog)
const dialogCreateModal = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')

const addPlaylistSong = (playlist: Playlists) => {
  emit('add-playlist-song', playlist)
}

const closeModal = (bool: boolean, showCreateModal: boolean) => {
  dialogAddModal.value = bool

  if (showCreateModal) {
    dialogCreateModal.value = true
  }
}

const closeModalCreate = () => {
  emit('close-modal-create', false)
}
</script>

<template>
  <div>
    <g-music-add-playlist-modal
      v-if="dialogAddModal"
      v-model="dialogAddModal"
      :song="props.song"
      @add-playlist-song="addPlaylistSong"
      @close-modal="closeModal"
      @update:model-value="closeModalCreate"
    />

    <g-music-create-playlist-modal
      v-if="dialogCreateModal"
      v-model="dialogCreateModal"
      @close-modal="closeModalCreate"
      @update:model-value="closeModalCreate"
    />
  </div>
</template>

<style scoped></style>
