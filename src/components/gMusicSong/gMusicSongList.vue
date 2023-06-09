<script setup lang="ts">
import { defineComponent } from 'vue'
import { Artist, Song } from '@/types/artist'

import gMusicSong from '@/components/gMusicSong/gMusicSong.vue'
import gMusicSongListNotFound from '@/components/gMusicSong/gMusicSongListNotFound.vue'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, useAuthStore } from '@/stores'

const { t } = useTranslation()
const authStore = useAuthStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    gMusicSong,
    gMusicSongListNotFound,
  },
})

interface Props {
  artist: Artist
  title?: string
  subTitle?: string
  artistId?: string
  list: Array<Song> | undefined
}

const props = defineProps<{
  title?: string
  subTitle?: string
  artist?: Artist
  artistId?: string
  list: Array<Song> | undefined
}>()

const emit = defineEmits([
  'toggleplay',
  'set-liked',
  'download',
  'view-artist',
  'go-to-album',
  'add-playlist',
  'dont-play-this',
])

const onAudioToggle = (song: Song, id: number | string, index: number) => {
  if (index >= 0 && authStore.user?.status === 'not-gooduser') {
    alertStore.error(t('playingOneSong'))
    return false
  }

  emit('toggleplay', { song, id, index })
}

const setLiked = (
  isSingle: boolean,
  object: { ids: string; is_add_to_liked: boolean }
) => {
  let idsSong = [] as Array<string>
  idsSong.push(object.ids)
  emit('set-liked', false, {
    ids: object.ids,
    is_add_to_liked: object.is_add_to_liked,
  })
}

const downloadSong = (id: string, name: string) => {
  emit('download', id, name)
}

const viewArtist = (url: string) => {
  emit('view-artist', url)
}

const goToAlbum = (artist: Artist) => {
  emit('go-to-album', artist)
}

const addPlayList = (song: Song) => {
  emit('add-playlist', song)
}

const dontPlayThis = (song: Song) => {
  emit('dont-play-this', song)
}
</script>

<template>
  <div class="g-music-song-list">
    <div class="g-music-song-list__wrap">
      <div v-if="props.title || props.subTitle" class="g-music-song-list__head">
        <h4 class="g-music-song-list__head-title" v-html="props.title"></h4>
        <router-link
          :to="`/artist/${props.artistId}/tracks`"
          class="g-music-song-list__head-sub-title"
        >
          {{ props.subTitle }}
        </router-link>
      </div>

      <div class="g-music-song-list__body">
        <template v-if="list.length">
          <g-music-song
            v-for="(item, index) of list"
            :key="item._id"
            :artist="artist"
            :artist-id="artistId"
            :song="item"
            @toggleplay="onAudioToggle(item, item._id, index)"
            @set-liked="setLiked"
            @download="downloadSong"
            @view-artist="viewArtist"
            @go-to-album="goToAlbum"
            @add-playlist="addPlayList"
            @dont-play-this="dontPlayThis"
          />
        </template>
        <g-music-song-list-not-found v-else />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
