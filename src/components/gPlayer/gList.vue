<script setup lang="ts">
import { computed, CSSProperties, defineComponent } from 'vue'
import { Song } from '@/types/artist'
import gListItem from './gListItem.vue'

const emit = defineEmits(['selectsong'])

defineComponent({
  components: {
    gListItem,
  },
})

interface Props {
  show?: boolean
  currentMusic?: Song | null
  musicList?: Array<Song> | undefined
  playIndex?: number
  theme?: string
  listmaxheight?: string
  fixed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  currentMusic: null,
  musicList: () => [],
  playIndex: 0,
  theme: '',
  listmaxheight: '',
  fixed: false,
})

const listHeightStyle = computed<CSSProperties>(() => {
  return {
    height: props.fixed ? '100%' : `${33 * props.musicList.length - 1}px`,
    maxHeight: props.listmaxheight || '',
  }
})

const selectSong = (song: Song) => {
  emit('selectsong', song)
}
</script>

<template>
  <transition name="slide-v">
    <div
      v-show="show"
      ref="list"
      class="g-player-list"
      :class="{ 'g-player-list-fixed': fixed }"
      :style="listHeightStyle"
    >
      <ol ref="ol" :style="listHeightStyle">
        <g-list-item
          v-for="(aMusic, index) of musicList"
          :key="aMusic._id"
          :current-music="currentMusic"
          :item="aMusic"
          :position="index + 1"
          @selectsong="selectSong"
        />
      </ol>
    </div>
  </transition>
</template>

<style lang="scss">
.g-player-list {
  overflow: hidden;

  &.g-player-list-fixed {
    bottom: 0;
    position: fixed;
    height: 100%;
    width: 100%;
    background: $greyscale100;
    overflow: hidden auto;
    z-index: -1;
    padding: 0 0 86px;

    @media #{$mobile} {
      z-index: 102;
    }
  }

  &.slide-v-enter-active,
  &.slide-v-leave-active {
    transition: $animate-delay;
    will-change: height;
  }

  &.slide-v-enter-from,
  &.slide-v-leave-to {
    overflow: hidden;
    max-height: 0;
    height: 0;
  }

  &.slide-v-enter-to,
  &.slide-v-leave-from {
    overflow: hidden;
    max-height: 100%;
    height: auto;
  }

  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f9f9f9;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #eee;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #ccc;
    }
  }
}

body.body--dark {
  .g-player-list {
    &.g-player-list-fixed {
      background: $dark-1;
    }
  }
}
</style>
