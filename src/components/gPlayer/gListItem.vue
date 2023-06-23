<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'
import { Song } from '@/types/artist'
import {
  useAlertStore,
  useAuthStore,
  usePlayerStore,
  useUsersStore,
} from '@/stores'

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
</script>

<template>
  <div
    class="g-player-list-item"
    :class="{ 'g-player-list-item_active': item._id === currentMusic._id }"
    @click="emit('selectsong', props.item)"
  >
    <div class="g-player-list-item__content">
      <div v-if="props.position" class="g-player-list-item__position">
        {{ props.position }}
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

        <span class="g-player-list-item__title-artist">{{
          props.item.artist || 'Untitled'
        }}</span>
      </div>
    </div>

    <div class="g-player-list-item__action">
      <span class="g-player-list-item__action-date-added"> Yesterday </span>
      <span class="g-player-list-item__action-duration"> 03:57 mins </span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
