<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useAlertStore, useAuthStore, useUsersStore } from '@/stores'
import { Playlists, Song } from '@/types/artist'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { useTranslation } from '@/composables/lang'
import { useRouter } from 'vue-router'
import { declensionOfWord } from '@/utils/utils'

const usersStore = useUsersStore()
const alertStore = useAlertStore()
const { t } = useTranslation()
const router = useRouter()

defineComponent({
  components: {
    DynamicIcon,
  },
})

const authStore = useAuthStore()

interface Data {
  menuTheme: boolean
}

const props = defineProps<{
  item: Playlists
  song?: Song | undefined
  hasAddPlaylist?: boolean
  href?: string
}>()

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const emit = defineEmits(['add-playlist', 'remove-playlist'])

const songsLength = computed<boolean>(() => {
  return props.item?.songs ? props.item?.songs?.length > 0 : false
})

const imagePlaylist = computed<string>(() => {
  if (!props.item?.cover_src && !props.song?.cover_src) {
    return ''
  } else {
    return props.item?.cover_src || props.song?.cover_src || ''
  }
})

const hasAddTrack = computed<boolean>(() => {
  const trackId: string | undefined = props.song?._id

  if (props.item?.songs) {
    const songIds: string[] = Array.isArray(props.item.songs)
      ? props.item.songs.map((song: Song | string) => {
          if (typeof song === 'string') {
            return song
          } else {
            return song?._id
          }
        })
      : []

    return trackId !== undefined && songIds.includes(trackId)
  }

  return false
})

const emitEvent = () => {
  if (hasAddTrack.value) {
    alertStore.error(t('gMusicPlaylistItem.errorAddSong'))
    return
  } else if (props.hasAddPlaylist || props.item?.icon === 'plus') {
    emit('add-playlist', props.item)
  } else if (props.item?.href) {
    router.push(props.item.href)
  } else {
    router.push(
      `/library/${authStore.user?.nickname}/playlists/${props.item._id}`
    )
  }
}

const removePlaylist = () => {
  emit('remove-playlist', props.item)
}
</script>

<template>
  <div class="g-music-playlist-item" @click.prevent="emitEvent">
    <div class="g-music-playlist-item__content">
      <div
        class="g-music-playlist-item__cover"
        :class="{
          'g-music-playlist-item__cover-default': !imagePlaylist,
        }"
      >
        <template v-if="imagePlaylist">
          <img :alt="props.item.name" :src="imagePlaylist" />
        </template>

        <DynamicIcon
          v-if="props.item?.icon"
          :name="props.item?.icon"
          :size="32"
        />

        <DynamicIcon v-if="hasAddTrack" name="add_playlist" :size="32" />
      </div>

      <div class="g-music-playlist-item__content-text">
        <div class="g-music-playlist-item__title">
          {{ props.item?.name || 'Unknown' }}
        </div>

        <div v-if="songsLength" class="g-music-playlist-item__description">
          {{ props.item?.songs?.length }}
          {{
            declensionOfWord(props.item?.songs?.length, [
              t('gMusicPlaylistItem.song'),
              t('gMusicPlaylistItem.songs'),
            ])
          }}
        </div>
      </div>
    </div>

    <div v-if="songsLength" class="g-music-playlist-item__action">
      <i
        v-if="props.item?._id !== 2"
        class="g-icon g-icon-dots"
        @click.prevent.stop=""
      >
        <span></span>

        <q-menu
          class="popover-menu"
          fit
          :dark="data.menuTheme"
          anchor="bottom right"
        >
          <q-list>
            <q-item
              v-if="authStore.user"
              v-close-popup
              clickable
              @click.prevent="removePlaylist"
            >
              <q-item-section avatar>
                <DynamicIcon :size="20" name="remove" />
              </q-item-section>

              <q-item-section>
                {{ t('gPlaylistHeader.removePlaylist') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </i>
    </div>
  </div>
</template>

<style scoped></style>
