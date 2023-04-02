<script lang="ts" setup>
import { computed, defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import GMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicPlaylistItem from '@/components/gMusicPlaylists/gMusicPlaylistItem.vue'
import gInput from '@/components/gInput/gInput.vue'
import { useTranslation } from '@/composables/lang'
import { minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gMusicFiltered,
    gMusicPlaylistItem,
    gInput,
  },
})

interface Playlist {
  name: string
  description: string
  playlistOptions: string
}

const data: Playlist = reactive({
  name: '',
  description: '',
  playlistOptions: 'Public',
})

const dialog = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const hasPublic = ref<boolean>(false)
const position = ref<any>('bottom')
const isLoading = ref<boolean>(false)
const dense = ref<boolean>(false)
const playlistsOptions = ref([
  {
    icon: 'public',
    label: 'Public',
  },
  {
    icon: 'private',
    label: 'Private',
  },
])

const items = ref([
  {
    _id: 1,
    icon: 'plus',
    name: 'Add New Playlist',
  },
  {
    _id: 2,
    icon: 'heart',
    name: 'Your Likes',
    songs: ['123131', '123131'],
  },
  {
    _id: 3,
    imageUrl: 'public/images/albums/breackMySoul.png',
    name: 'My Favorite Pop Songs',
    code: '1',
    songs: ['123131', '123131'],
  },
])

const rules = computed(() => {
  return {
    name: { required, minLength: minLength(6) },
    description: { required, minLength: minLength(6) },
    playlistOptions: { required },
  }
})

const v$ = useVuelidate(rules, data)

const isDisabledButton = computed<boolean>(() => {
  return v$.value.$invalid
})

const openAddPlaylist = (pos: string) => {
  position.value = pos
  dialog.value = true
}

const addPlayList = () => {
  openAddPlaylist('bottom')
}

const createPlaylist = () => {
  console.log('Creating playlist')
}

const onRecently = () => {
  console.log('Recently')
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back
            icon="back"
            :label="t('pages.playlists.buttonBackPlaylists')"
            @click.prevent="$router.go(-1)"
          />

          <div class="q-page__header-actions">
            <DynamicIcon name="search" :size="28" />

            <div class="q-page__header-dropdown">
              <i class="g-icon g-icon-dropdown-menu">
                <span></span>
              </i>
            </div>
          </div>
        </div>

        <g-music-filtered
          :label="t('pages.playlists.label')"
          :recently="t('pages.playlists.recently')"
          @recently="onRecently"
        />

        <g-music-playlist-item
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          @add-playlist="addPlayList"
        />
      </div>
    </div>
  </div>

  <q-dialog
    ref="qDialogPopup"
    v-model="dialog"
    :position="position"
    class="g-popup-playlist"
  >
    <q-card>
      <q-card-section class="g-popup-playlist__body text-center">
        <form>
          <h4>{{ t('pages.playlists.popup.title') }}</h4>

          <g-input
            v-model="data.name"
            :dense="dense"
            :placeholder="t('pages.playlists.popup.namePlaceholder')"
            class="g-popup-playlist__inputs-label"
            :rules="[
            (val: string) => val.length >= 6 || t('pages.playlists.popup.nameValidDescription'),
          ]"
            standout
          />

          <g-input
            v-model="data.description"
            :dense="dense"
            :placeholder="t('pages.playlists.popup.descriptionPlaceholder')"
            class="g-popup-playlist__inputs-label"
            :rules="[
            (val: string) => val.length >= 6 || t('pages.playlists.popup.descriptionValidDescription'),
          ]"
            standout
          />

          <q-select
            v-model="data.playlistOptions"
            :options="playlistsOptions"
            class="g-popup-playlist__select"
            outlined
          >
            <template #prepend>
              <DynamicIcon name="public" :size="20" />
            </template>
          </q-select>

          <div class="g-popup-playlist__action">
            <q-btn
              v-close-popup
              :label="t('pages.playlists.popup.buttonCancel')"
              class="q-btn--light-primary q-btn-large full-width"
              rounded
              text-color="''"
              unelevated
            />

            <q-btn
              :label="t('pages.playlists.popup.buttonConfirm')"
              :disabled="isDisabledButton"
              :loading="isLoading"
              class="q-btn-large full-width"
              rounded
              text-color="''"
              unelevated
              @click.prevent="createPlaylist"
            />
          </div>
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
