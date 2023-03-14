<script setup lang="ts">
import { calculateLineHeadPosition, getElementViewLeft } from '@/utils/utils'
import { computed, CSSProperties, reactive, ref } from 'vue'

const emit = defineEmits(['dragbegin', 'dragging', 'dragend', 'dragbegin'])

const props = defineProps<{
  loadProgress: number
  playProgress: number
  theme?: string
}>()

interface Data {
  thumbHovered: boolean
}

const data: Data = reactive({
  thumbHovered: false,
})

const barWrap = ref<HTMLElement>(document.createElement('div'))

const widthLoaded = computed<CSSProperties>(() => {
  return {
    width: `${props.loadProgress * 100}%`,
  }
})
const playedStyles = computed<CSSProperties>(() => {
  return {
    width: `${props.playProgress * 100}%`,
  }
})

const onThumbMouseDown = (event: MouseEvent) => {
  const barWidth = barWrap.value.clientWidth
  let percentage =
    (event.clientX - getElementViewLeft(barWrap.value)) / barWidth

  percentage = percentage > 0 ? percentage : 0
  percentage = percentage < 1 ? percentage : 1

  emit('dragbegin', percentage)
  document.addEventListener('mousemove', onDocumentMouseMove)
  document.addEventListener('mouseup', onDocumentMouseUp)
}

const onDocumentMouseMove = (event: MouseEvent) => {
  const seekPos = calculateLineHeadPosition(event, barWrap.value)
  emit('dragging', seekPos)
}

const onDocumentMouseUp = (event: MouseEvent) => {
  document.removeEventListener('mouseup', onDocumentMouseUp)
  document.removeEventListener('mousemove', onDocumentMouseMove)

  const seekPos = calculateLineHeadPosition(event, barWrap.value)
  emit('dragend', seekPos)
}

const onThumbTouchStart = (event: any) => {
  const barWidth = barWrap.value.clientWidth
  let percentage =
    (event.clientX - getElementViewLeft(barWrap.value)) / barWidth
  percentage = percentage > 0 ? percentage : 0
  percentage = percentage < 1 ? percentage : 1

  emit('dragbegin', percentage)
  document.addEventListener('touchmove', onDocumentTouchMove)
  document.addEventListener('touchend', onDocumentTouchEnd)
}

const onDocumentTouchMove = (event: any) => {
  const touch = event.changedTouches[0]
  const barWidth = barWrap.value.clientWidth
  let percentage =
    (touch.clientX - getElementViewLeft(barWrap.value)) / barWidth
  percentage = percentage > 0 ? percentage : 0
  percentage = percentage < 1 ? percentage : 1

  emit('dragging', percentage)
}

const onDocumentTouchEnd = (e: any) => {
  document.removeEventListener('touchend', onDocumentTouchEnd)
  document.removeEventListener('touchmove', onDocumentTouchMove)

  const touch = e.changedTouches[0]
  const barWidth = barWrap.value.clientWidth
  let percentage =
    (touch.clientX - getElementViewLeft(barWrap.value)) / barWidth
  percentage = percentage > 0 ? percentage : 0
  percentage = percentage < 1 ? percentage : 1
  emit('dragend', percentage)
}
</script>

<template>
  <div class="g-player-track-control-bar">
    <slot name="ptime"></slot>

    <div
      ref="barWrap"
      class="g-player-bar-wrap"
      @mousedown="onThumbMouseDown"
      @touchstart="onThumbTouchStart"
    >
      <div class="g-player-bar">
        <div class="g-player-loaded" :style="widthLoaded"></div>
        <div class="g-player-played" :style="playedStyles">
          <span
            ref="thumb"
            class="g-player-thumb"
            @mouseover="data.thumbHovered = true"
            @mouseout="data.thumbHovered = false"
          >
          </span>
        </div>
      </div>
    </div>

    <slot name="dtime"></slot>
  </div>
</template>

<style lang="scss">
.g-player-bar-wrap {
  position: relative;
  display: flex;
  align-items: center;

  .g-player-bar {
    position: relative;
    height: 4px;
    width: 100%;
    background: $greyscale300;
    border-radius: 9999px;

    cursor: pointer;

    .g-player-loaded {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: $primary200;
      height: 4px;
      border-radius: 9999px;
    }

    .g-player-played {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      height: 4px;
      border-radius: 9999px;
      background: linear-gradient(
        286.17deg,
        $button-disabled 0%,
        $primary400 100%
      );
    }
  }
}

body.body--dark {
  .g-player-bar-wrap {
    .g-player-ptime,
    .g-player-dtime {
      color: $white;
    }

    .g-player-bar {
      background: $dark-3;
    }
  }
}
</style>
