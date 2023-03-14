<script setup lang="ts">
import { computed, defineComponent } from 'vue'

import gControllerProgress from './gControllerProgress.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'

defineComponent({
  components: {
    DynamicIcon,
    gControllerProgress,
    gPlayBtn,
  },
})

const emit = defineEmits([
  'dragbegin',
  'dragend',
  'dragging',
  'toggleplay',
  'track-prev',
  'track-rewind-prev',
  'track-next',
  'track-rewind-next',
])

const props = defineProps<{
  stat?: any
  theme?: string
  hasControls?: boolean
  playing?: boolean
}>()

const loadProgress = computed<number>(() => {
  if (props.stat?.duration === 0) return 0
  return props.stat?.loadedTime / props.stat?.duration
})

const playProgress = computed<number>(() => {
  if (props.stat.duration === 0) return 0
  return props.stat.playedTime / props.stat.duration
})

const secondToTime = (second: number) => {
  if (isNaN(second)) {
    return '00:00'
  }
  const pad0 = (num: number) => {
    return num < 10 ? '0' + num : '' + num
  }

  const min = Math.trunc(second / 60)
  const sec = Math.trunc(second - min * 60)
  const hours = Math.trunc(min / 60)
  const minAdjust = Math.trunc(second / 60 - 60 * Math.trunc(second / 60 / 60))
  return second >= 3600
    ? pad0(hours) + ':' + pad0(minAdjust) + ':' + pad0(sec)
    : pad0(min) + ':' + pad0(sec)
}
</script>

<template>
  <div class="g-player-controller">
    <div class="g-player-controller-track"></div>
    <div class="g-player-track-control">
      <div class="g-player-track-control-buttons">
        <DynamicIcon
          v-if="props.hasControls"
          name="track-prev"
          @click.prevent="emit('track-prev')"
        />

        <DynamicIcon
          name="track-rewind-prev"
          @click.prevent="emit('track-rewind-prev')"
        />

        <g-play-btn
          :class="props.playing ? 'g-player-icon-pause' : 'g-player-icon-play'"
          :playing="props.playing"
          @click.prevent="$emit('toggleplay')"
        />

        <DynamicIcon
          name="track-rewind-next"
          @click.prevent="emit('track-rewind-next')"
        />

        <DynamicIcon
          v-if="props.hasControls"
          name="track-next"
          @click.prevent="emit('track-next')"
        />
      </div>

      <g-controller-progress
        :load-progress="loadProgress"
        :play-progress="playProgress"
        :theme="props.theme"
        @dragbegin="emit('dragbegin', $event)"
        @dragend="emit('dragend', $event)"
        @dragging="emit('dragging', $event)"
      >
        <template #ptime>
          <span class="g-player-ptime">
            {{ secondToTime(props.stat.playedTime) }}
          </span>
        </template>

        <template #dtime>
          <span class="g-player-dtime">
            {{ secondToTime(props.stat.duration) }}
          </span>
        </template>
      </g-controller-progress>
    </div>
  </div>
</template>

<style lang="scss">
.g-player-controller {
  position: relative;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;

  .g-player-bar-wrap {
    display: flex;
    width: 100%;
  }

  .g-player-track-control {
    position: relative;
    width: 100%;
    max-width: 663px;

    &-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      margin: 8px 0 0;

      .g-player-ptime,
      .g-player-dtime {
        display: flex;
        align-items: center;
        font-size: $size-16;
        font-weight: 500;
        line-height: $lh-22;
        letter-spacing: 0.2px;
        color: $greyscale900;
      }
    }

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

      &-track-prev,
      &-track-next,
      &-track-rewind-prev,
      &-track-rewind-next {
        @include hover-supported {
          path {
            fill: $primary;
          }
        }
      }

      &-play,
      &-pause {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
