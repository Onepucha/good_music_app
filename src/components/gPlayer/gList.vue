<script setup lang="ts">
import { computed, CSSProperties } from 'vue'
import { Song } from '@/types/artist'

const emit = defineEmits(['selectsong'])

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
        <li
          v-for="(aMusic, index) of musicList"
          :key="index"
          :class="{ 'g-player-list-light': aMusic === currentMusic }"
          @click="emit('selectsong', aMusic)"
        >
          <span class="g-player-list-cur" :style="{ background: theme }"></span>
          <span class="g-player-list-index">
            {{ index + 1 }}
          </span>
          <span class="g-player-list-title">
            {{ aMusic.title || 'Untitled' }}
          </span>
          <span class="g-player-list-author">
            {{ aMusic.artist || 'Unknown' }}
          </span>
        </li>
      </ol>
    </div>
  </transition>
</template>

<style lang="scss">
.g-player-list {
  overflow: hidden;

  &.g-player-list-fixed {
    top: 0;
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgb(26, 26, 26);
    overflow: hidden auto;
    z-index: -1;
  }

  &.slide-v-enter-active,
  &.slide-v-leave-active {
    transition: $animate-delay;
    will-change: height;
  }

  &.slide-v-enter,
  &.slide-v-leave-to {
    height: 0 !important;
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

    @include hover-supported {
      li.g-player-list-light:not(:hover) {
        background-color: inherit;
        transition: inherit;
      }
    }

    &:not(:hover) {
      li.g-player-list-light {
        transition: $animate-delay;
      }
    }

    li {
      position: relative;
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
      font-size: 12px;
      border-top: 1px solid #e9e9e9;
      cursor: pointer;
      transition: $animate-delay;
      overflow: hidden;
      margin: 0;
      text-align: start;
      display: flex;

      &:first-child {
        border-top: none;
      }

      @include hover-supported {
        background: #efefef;
      }

      &.g-player-list-light {
        background: #efefef;

        .g-player-list-cur {
          display: inline-block;
        }
      }

      .g-player-list-cur {
        display: none;
        width: 3px;
        height: 22px;
        position: absolute;
        left: 0;
        top: 5px;
        transition: $animate-delay;
      }

      .g-player-list-index {
        color: #666;
        margin-right: 12px;
      }

      .g-player-list-title {
        flex-grow: 1;
      }

      .g-player-list-author {
        flex-shrink: 0;
        color: #666;
        float: right;
      }
    }
  }
}
</style>
