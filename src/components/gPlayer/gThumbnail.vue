<script setup lang="ts">
import { computed, CSSProperties, onUnmounted, reactive } from 'vue'
import { usePlayerStore } from '@/stores'

const playerStore = usePlayerStore()

const emit = defineEmits(['dragbegin', 'dragging', 'dragend'])

interface Song {
  title: string
  artist: string
  src: string
  pic: string
}

interface Props {
  currentMusic: Song
  theme?: string
  enableDrag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pic: '',
  theme: '',
  enableDrag: false,
})

interface Data {
  hasMovedSinceMouseDown: boolean
  dragStartX: number
  dragStartY: number
}

const data: Data = reactive({
  hasMovedSinceMouseDown: false,
  dragStartX: 0,
  dragStartY: 0,
})

const currentPicStyleObj = computed<CSSProperties>(() => {
  if (!props.currentMusic?.pic) return {}
  return {
    backgroundImage: `url('${props.currentMusic?.pic}')`,
    backgroundColor: props.theme,
  }
})

const onDragBegin = (e: MouseEvent) => {
  if (props.enableDrag) {
    data.hasMovedSinceMouseDown = false
    emit('dragbegin', e)
    data.dragStartX = e.clientX
    data.dragStartY = e.clientY
    document.addEventListener('mousemove', onDocumentMouseMove)
    document.addEventListener('mouseup', onDocumentMouseUp)
  }
}

const onDocumentMouseMove = (e: MouseEvent) => {
  data.hasMovedSinceMouseDown = true
  emit('dragging', {
    offsetLeft: e.clientX - data.dragStartX,
    offsetTop: e.clientY - data.dragStartY,
  })
}

const onDocumentMouseUp = (e: Event) => {
  document.removeEventListener('mouseup', onDocumentMouseUp)
  document.removeEventListener('mousemove', onDocumentMouseMove)

  emit('dragend', e)
}

onUnmounted(() => {
  window.removeEventListener('mouseup', onDocumentMouseUp)
  window.removeEventListener('mousemove', onDocumentMouseMove)
})
</script>

<template>
  <router-link
    class="g-player-pic"
    :class="{
      'g-player-pic-default': !currentPicStyleObj?.backgroundImage,
    }"
    :style="currentPicStyleObj"
    :to="`/artist/${currentMusic.artist?._id}/track/${currentMusic._id}`"
    @mousedown="onDragBegin"
  ></router-link>
</template>

<style lang="scss">
.g-player-float {
  .g-player-pic:active {
    cursor: move;
  }
}

.g-player-pic {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  height: $g-player-height;
  width: $g-player-height;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
  border-radius: 8px;
  background-size: cover;
  transition: $animate-delay;
  cursor: pointer;

  &-default {
    background: linear-gradient(
      141.82deg,
      #42d0e1 0%,
      #f2e58d 32.64%,
      #fec856 50.01%,
      #f77e0c 78.11%,
      #f0de51 101.07%
    );
    animation: rotate-hue 6s alternate infinite;
  }

  @media #{$mobile} {
    width: 48px;
    height: 48px;
  }

  @keyframes rotate-hue {
    to {
      filter: hue-rotate(1turn);
    }
  }

  @include hover-supported {
    .g-player-button {
      opacity: 1;
    }
  }

  .g-icon {
    &-play,
    &-pause {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
