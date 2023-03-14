<script setup lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { Artist } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
import { useTranslation } from '@/composables/lang'
import Readmore from '@/components/Readmore.vue'
import { useUsersStore } from '@/stores'

const { t } = useTranslation()
const usersStore = useUsersStore()

defineComponent({
  components: {
    DynamicIcon,
    Readmore,
  },
})

const emit = defineEmits(['add-follow', 'like', 'add-playlist', 'download'])

interface Menu {
  label: string
  icon: string
}

interface Data {
  menuTheme: boolean
  menu: Menu[]
}

const props = defineProps<{
  artist: Artist
}>()

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
  menu: [
    {
      label: t('gMusicSong.like'),
      icon: 'like',
    },
    {
      label: t('gMusicSong.addToPlaylist'),
      icon: 'add_playlist',
    },
    {
      label: t('gMusicSong.dontPlayThis'),
      icon: 'dont_play',
    },
    {
      label: t('gMusicSong.download'),
      icon: 'download_song',
    },
    {
      label: t('gMusicSong.viewArtist'),
      icon: 'artist',
    },
    {
      label: t('gMusicSong.gotoAlbum'),
      icon: 'play_album',
    },
    {
      label: t('gMusicSong.share'),
      icon: 'share',
    },
  ],
})

const follow = ref<boolean>(false)

const followBtnText = computed<string>(() => {
  return follow.value ? 'Following' : 'Follow'
})

const followBtnClass = computed<string>(() => {
  return follow.value ? 'q-btn-border' : ''
})

const infoLength = computed<boolean>(() => {
  return props.artist?.info ? props.artist?.info?.length > 0 : false
})

const toggleFollow = (artist: Artist) => {
  follow.value = !follow.value
  emit('add-follow', artist)
}
</script>

<template>
  <div class="g-album-profiles">
    <div class="g-album-profiles__head">
      <q-avatar
        :size="'200px'"
        class="g-album-profiles__picture"
        :class="{
          'g-album-profiles__picture-default': !props.artist?.imageUrl,
        }"
      >
        <template v-if="props.artist?.imageUrl">
          <img :alt="props.artist.name" :src="props.artist?.imageUrl" />
        </template>
      </q-avatar>

      <h3 class="g-album-profiles__title">
        {{ props.artist?.album || 'Unknown' }}
      </h3>

      <div class="g-album-profiles__artist-name">
        {{ props.artist?.name || 'Untitled' }}
      </div>

      <div v-if="infoLength" class="g-album-profiles__info">
        <span v-for="(item, index) in props.artist.info" :key="index">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="g-album-profiles__main">
      <div class="g-album-profiles__actions">
        <DynamicIcon :size="24" name="heart" @click.prevent="emit('like')" />

        <DynamicIcon
          :size="24"
          name="add_playlist"
          @click.prevent="emit('add-playlist')"
        />

        <DynamicIcon
          :size="24"
          name="download_song"
          @click.prevent="emit('download')"
        />

        <i class="g-icon g-icon-dots" @click.prevent.stop="">
          <span></span>

          <q-menu
            class="popover-menu"
            fit
            :dark="data.menuTheme"
            anchor="bottom right"
          >
            <q-list>
              <q-item
                v-for="(item, index) in data.menu"
                :key="index"
                v-close-popup
                clickable
              >
                <q-item-section avatar>
                  <DynamicIcon :size="20" :name="item.icon" />
                </q-item-section>

                <q-item-section>
                  {{ item.label }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </i>
      </div>

      <div class="g-album-profiles__side-actions">
        <q-btn
          :class="followBtnClass"
          :label="followBtnText"
          class="q-btn-medium"
          rounded
          text-color="''"
          unelevated
          @click.prevent="toggleFollow(props.artist)"
        />
      </div>
    </div>

    <div class="g-album-profiles__info-cell">
      <Readmore
        :slice="20"
        :long-text="'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad'"
      />
    </div>
  </div>
</template>

<style scoped></style>
