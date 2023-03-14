<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import { calculateLineHeadPosition } from '@/utils/utils'
import { computed, CSSProperties, defineComponent, ref } from 'vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const emit = defineEmits(['setvolume', 'togglemute'])

const props = defineProps<{
  volume: number
  muted: number | boolean
  theme?: string
}>()

const volumeIcon = computed<string>(() => {
  if (props.muted || props.volume <= 0) return 'volume-off'
  if (props.volume >= 1) return 'volume-up'
  return 'volume-down'
})

const volumeStyle = computed<CSSProperties>(() => {
  return {
    width: props.muted ? 0 : `${Math.trunc(props.volume * 100)}%`,
  }
})

const bar = ref<HTMLElement>(document.createElement('div'))

const onBarMouseDown = () => {
  document.addEventListener('mousemove', onDocumentMouseMove)
  document.addEventListener('mouseup', onDocumentMouseUp)
}

const onDocumentMouseMove = (event: MouseEvent) => {
  const seekPos = calculateLineHeadPosition(event, bar.value)
  emit('setvolume', seekPos)
}

const onDocumentMouseUp = (event: MouseEvent) => {
  document.removeEventListener('mouseup', onDocumentMouseUp)
  document.removeEventListener('mousemove', onDocumentMouseMove)
  const seekPos = calculateLineHeadPosition(event, bar.value)
  emit('setvolume', seekPos)
}
</script>

<template>
  <div class="g-player-volume-wrap">
    <DynamicIcon
      :class="`g-player-icon-${volumeIcon}`"
      :name="volumeIcon"
      @click.prevent="$emit('togglemute')"
    />
    <div class="g-player-volume-bar-wrap" @mousedown="onBarMouseDown">
      <div ref="bar" class="g-player-volume-bar">
        <div class="g-player-volume" :style="volumeStyle"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.g-player-volume-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  @include hover-supported {
    .g-player-volume-bar-wrap {
      .g-player-volume {
        background: $primary;
      }
    }
  }

  .g-icon {
    @include hover-supported {
      path {
        stroke: $primary;
      }
    }
  }

  .g-player-volume-bar-wrap {
    position: relative;
    transition: $animate-delay;

    .g-player-volume-bar {
      position: relative;
      width: 88px;
      height: 4px;
      background: $greyscale300;
      border-radius: 9999px;
      overflow: hidden;
      z-index: 1;

      .g-player-volume {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        will-change: width;
        border-radius: 9999px;
        background: $greyscale400;
      }
    }
  }
}
</style>
