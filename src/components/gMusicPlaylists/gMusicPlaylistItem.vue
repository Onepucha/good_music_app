<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useAuthStore, useUsersStore } from '@/stores'
import { Playlists } from '@/types/artist'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { useTranslation } from '@/composables/lang'
import { useRouter } from 'vue-router'
import { declensionOfWord } from '@/utils/utils'

const usersStore = useUsersStore()
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
  hasAddPlaylist?: boolean
}>()

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const emit = defineEmits(['add-playlist'])

const songsLength = computed<boolean>(() => {
  return props.item?.songs ? props.item?.songs?.length > 0 : false
})

const emitEvent = () => {
  if (props.hasAddPlaylist || props.item?.icon === 'plus') {
    emit('add-playlist', props.item)
  } else {
    router.push(
      `/library/${authStore.user?.nickname}/playlists/${props.item._id}`
    )
  }
}
</script>

<template>
  <div class="g-music-playlist-item" @click.prevent="emitEvent">
    <div class="g-music-playlist-item__content">
      <div
        class="g-music-playlist-item__cover"
        :class="{
          'g-music-playlist-item__cover-default': !props.item?.imageUrl,
        }"
      >
        <template v-if="props.item?.imageUrl">
          <img :alt="props.item.name" :src="props.item?.imageUrl" />
        </template>

        <DynamicIcon
          v-if="props.item?.icon"
          :name="props.item?.icon"
          :size="32"
        />
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
      <i class="g-icon g-icon-dots" @click.prevent.stop="">
        <span></span>

        <q-menu
          class="popover-menu"
          fit
          :dark="data.menuTheme"
          anchor="bottom right"
        >
          <q-list>
            <q-item v-close-popup clickable>
              <q-item-section avatar>
                <!--                <DynamicIcon :size="20" name="dont_play" />-->
              </q-item-section>

              <q-item-section>
                123
                <!--                {{ t('gAlbumProfiles.dontPlayThis') }}-->
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </i>
    </div>
  </div>
</template>

<style scoped></style>
