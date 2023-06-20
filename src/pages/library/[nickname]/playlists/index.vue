<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gMusicFiltered from '@/components/gMusicFiltered/gMusicFiltered.vue'
import gMusicPlaylistItem from '@/components/gMusicPlaylists/gMusicPlaylistItem.vue'
import { useTranslation } from '@/composables/lang'
import PlaylistsApi from '@/services/playlists'
import { Playlists } from '@/types/artist'
import { useAuthStore } from '@/stores'
import gMusicCreatePlaylistModal from '@/components/gMusicCreatePlaylistModal/gMusicCreatePlaylistModal.vue'
import { useMeta } from 'quasar'

const { t } = useTranslation()
const authStore = useAuthStore()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gLoader,
    gMusicFiltered,
    gMusicPlaylistItem,
    gMusicCreatePlaylistModal,
  },
})

interface Data {
  playlists: Array<Playlists>
  playlist: Playlists | undefined
  page: number
  playlistsCount: number
  name: string
  description: string
}

const data: Data = reactive({
  name: '',
  description: '',
  playlists: [],
  playlist: undefined,
  page: 0,
  playlistsCount: 24,
})

useMeta(() => {
  return {
    title: t('pages.library.playlists.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.library.playlists.contentHead'),
      },
    },
  }
})

const dialog = ref<boolean>(false)
const dialogRemove = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')

const addPlaylistItem = ref({
  _id: 1,
  icon: 'plus',
  name: 'Add New Playlist',
})

const yourLikes = ref({
  _id: 2,
  href: `/library/${authStore.user?.nickname}/songs`,
  icon: 'heart',
  name: 'Your Likes',
  songs: authStore.user?.songs,
})

const onRecently = () => {
  console.log('Recently')
}

const scrollTargetRef = ref<any>(document.createElement('div'))

const getPlaylists = async (index: number, done: () => void) => {
  try {
    data.page++
    const response: any = await PlaylistsApi.getLikedYour({
      count: data.playlistsCount,
      page: data.page,
    })

    if (response.data.playlists.length === 0) {
      scrollTargetRef.value.stop()
    }

    done()

    response.data.playlists.forEach((itemToAdd: Playlists) => {
      const index = data.playlists.findIndex(
        (item) => item._id === itemToAdd._id
      )
      if (index === -1) {
        data.playlists.push(itemToAdd)
      }
    })
  } catch (error: unknown) {
    console.error(error)
    scrollTargetRef.value.stop()
  }
}

const openAddPlaylist = () => {
  dialog.value = true
}

const closeModal = async (bool: boolean) => {
  dialog.value = bool
  data.page = 0
  await getPlaylists(0, () => {
    return true
  })
}

const removePlaylist = (playlist: Playlists) => {
  data.playlist = playlist
  dialogRemove.value = true
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

      dialogRemove.value = false
    }
  } catch (error: unknown) {
    console.error(error)
  }
}

const openSearch = () => {
  authStore.searchModal = true
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
            <DynamicIcon name="search" :size="28" @click.prevent="openSearch" />

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
            @add-playlist="openAddPlaylist"
          />
          <g-music-playlist-item :item="yourLikes" />

          <g-music-playlist-item
            v-for="(playlist, index) in data.playlists"
            :key="index"
            :item="playlist"
            @add-playlist="openAddPlaylist"
            @remove-playlist="removePlaylist"
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
  <g-music-create-playlist-modal v-model="dialog" @close-modal="closeModal" />

  <q-dialog
    ref="qDialogPopup"
    v-model="dialogRemove"
    :position="position"
    class="g-popup-profile"
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
</template>
