<script setup lang="ts">
import { defineComponent } from 'vue'
import { Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const props = defineProps<{
  item: Song
}>()

const emit = defineEmits(['toggleplay', 'track-next'])
</script>

<template>
  <div class="g-play-overscreen">
    <div class="g-music-song__content">
      <div
        class="g-play-overscreen__picture"
        :class="{ 'g-play-overscreen__picture-default': !props.item?.imageUrl }"
      >
        <img
          v-if="props.item?.imageUrl"
          :alt="props.item.name"
          :src="props.item?.imageUrl"
        />
      </div>

      <div class="g-play-overscreen__title">
        {{ props.item?.name || 'Unknown' }}
      </div>
    </div>

    <div class="g-play-overscreen__action">
      <DynamicIcon :size="20" name="play" @click.prevent="emit('toggleplay')" />

      <DynamicIcon
        :size="20"
        name="track-next"
        @click.prevent="emit('track-next')"
      />
    </div>
  </div>
</template>

<style scoped></style>
