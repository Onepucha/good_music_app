<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'
import { Song } from '@/types/artist'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores'
import { computed } from 'vue'

const { t } = useTranslation()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

const props = defineProps<{
  item: Song
  currentMusic: Song
  position: number
}>()

const emit = defineEmits(['selectsong'])

const padPosition = computed<string>(() => {
  return props.position.toString().padStart(2, '0')
})

const duration = computed<string>(() => {
  if (props.item && props.item.duration !== null) {
    const date = new Date(props.item.duration || 1000)
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${minutes}:${seconds} ${t('gMusicSong.mins')}`
  }

  return ''
})

const releaseDate = computed<string>(() => {
  if (props.item && props.item.release_date !== undefined) {
    const date = new Date(props.item.release_date)

    return date.toLocaleDateString()
  }
  return ''
})
</script>

<template>
  <div
    class="g-player-list-item"
    :class="{ 'g-player-list-item_active': item._id === currentMusic._id }"
    @click="emit('selectsong', props.item)"
  >
    <div class="g-player-list-item__content">
      <div v-if="props.position" class="g-player-list-item__position">
        {{ padPosition }}
      </div>
      <div
        class="g-player-list-item__picture"
        :class="{
          'g-player-list-item__picture-default': !props.item?.cover_src,
        }"
      >
        <img
          v-if="props.item?.cover_src"
          :alt="props.item.name"
          :src="props.item?.cover_src"
        />
      </div>

      <div class="g-player-list-item__title">
        {{ props.item.name || 'Untitled' }}

        <span class="g-player-list-item__title-artist">
          {{ props.item?.artist || props.item?.artists[0]?.name || 'Untitled' }}
        </span>
      </div>
    </div>

    <div class="g-player-list-item__action">
      <span v-if="releaseDate" class="g-player-list-item__action-date-added">
        {{ releaseDate }}
      </span>
      <span v-if="duration" class="g-player-list-item__action-duration">
        {{ duration }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
