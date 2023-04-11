<script lang="ts" setup>
import { computed, defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicPlaylistItem from '@/components/gMusicPlaylists/gMusicPlaylistItem.vue'
import gInput from '@/components/gInput/gInput.vue'
import { useTranslation } from '@/composables/lang'
import { minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import PlaylistsApi from '@/services/playlists'
import { Playlists } from '@/types/artist'
import { useAuthStore } from '@/stores'

const { t } = useTranslation()
const authStore = useAuthStore()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gLoader,
    gMusicFiltered,
    gMusicPlaylistItem,
    gInput,
  },
})

interface Data {
  playlists: Array<Playlists>
  page: number
  playlistsCount: number
  isLoading: boolean
  name: string
  description: string
  playlistOptions: any
}

const data: Data = reactive({
  name: '',
  description: '',
  playlistOptions: {
    icon: 'public',
    label: 'Public',
  },
  playlists: [],
  page: 0,
  playlistsCount: 24,
  isLoading: false,
})

const dialog = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
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

const addPlaylistItem = ref({
  _id: 1,
  icon: 'plus',
  name: 'Add New Playlist',
})

const yourLikes = ref({
  _id: 2,
  icon: 'heart',
  name: 'Your Likes',
  songs: authStore.user?.songs,
})

const rules = computed(() => {
  return {
    name: { required, minLength: minLength(6) },
    description: { required, minLength: minLength(6) },
    playlistOptions: { required },
  }
})

const v$ = useVuelidate(rules, data)

const hasPublic = computed<boolean>(() => {
  return data.playlistOptions.label === 'Public'
})

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

const createPlaylist = async () => {
  try {
    let code = data.name.replaceAll(' ', '_').toLowerCase()
    await PlaylistsApi.setPlaylist({
      name: data.name,
      code: code, // TODO description: data.description,
      hasPublic: hasPublic.value,
    })
    dialog.value = false
  } catch (error: unknown) {
    console.error(error)
  }
}

const onRecently = () => {
  console.log('Recently')
}

const scrollTargetRef = ref<any>(document.createElement('div'))

const getPlaylists = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await PlaylistsApi.getAll({
      count: data.playlistsCount,
      page: data.page,
    })

    if (response.data.playlists.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()
    data.playlists = data.playlists.concat(response.data.playlists)
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
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

        <q-infinite-scroll
          ref="scrollTargetRef"
          :offset="250"
          @load="getPlaylists"
        >
          <g-music-playlist-item
            :item="addPlaylistItem"
            @add-playlist="addPlayList"
          />
          <g-music-playlist-item :item="yourLikes" />

          <g-music-playlist-item
            v-for="(playlist, index) in data.playlists"
            :key="index"
            :item="playlist"
            @add-playlist="addPlayList"
          />

          <template #loading>
            <div class="row justify-center q-my-md">
              <g-loader />
            </div>
          </template>
        </q-infinite-scroll>
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
            standout
            :rules="[
            (val: string) => val.length >= 6 || t('pages.playlists.popup.nameValidDescription')]"
          />

          <g-input
            v-model="data.description"
            :dense="dense"
            :placeholder="t('pages.playlists.popup.descriptionPlaceholder')"
            class="g-popup-playlist__inputs-label"
            standout
            :rules="[
            (val: string) => val.length >= 6 || t('pages.playlists.popup.descriptionValidDescription')]"
          />

          <q-select
            v-model="data.playlistOptions"
            :options="playlistsOptions"
            class="g-popup-playlist__select"
            outlined
          >
            <template #prepend>
              <DynamicIcon :name="data.playlistOptions.icon" :size="20" />
            </template>

            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <DynamicIcon :name="scope.opt.icon" :size="20" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
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
