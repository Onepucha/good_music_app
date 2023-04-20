<script setup lang="ts">
import { defineComponent } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const emit = defineEmits(['toggleplay', 'track-next'])

const props = defineProps<{
  hasControls?: boolean
  playing?: boolean
}>()
</script>

<template>
  <div class="g-player-controller-mini">
    <div class="g-player-controller-mini-track"></div>
    <div class="g-player-track-control">
      <div class="g-player-track-control-buttons">
        <DynamicIcon
          :name="props.playing ? 'pause' : 'play'"
          :size="20"
          @click.prevent="$emit('toggleplay')"
        />

        <DynamicIcon
          v-if="props.hasControls"
          name="track-next"
          :size="20"
          @click.prevent="emit('track-next')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.g-player-controller-mini {
  position: relative;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;

  .g-player-track-control {
    position: relative;
    width: 100%;
    max-width: 663px;

    .g-player-track-control-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;

      @media #{$mobile} {
        gap: 16px;
        justify-content: flex-end;
      }
    }

    .g-icon {
      cursor: pointer;
      user-select: none;

      &-track-next {
        path {
          fill: $primary;
        }

        @include hover-supported {
          path {
            fill: $primary;
          }
        }
      }

      &-play,
      &-pause {
        path {
          fill: $primary;
        }
      }
    }
  }
}
</style>
