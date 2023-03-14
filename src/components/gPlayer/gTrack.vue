<script setup lang="ts">
import gThumbnail from './gThumbnail.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

defineComponent({
  components: {
    DynamicIcon,
    gThumbnail,
  },
})

const $q = useQuasar()

interface Song {
  title: string
  artist: string
  src: string
  pic: string
}

interface Props {
  currentMusic: Song
  theme?: string
  playing?: boolean
  enableDrag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pic: '',
  theme: '',
  playing: false,
  enableDrag: false,
})

const emit = defineEmits(['toggleplay', 'dragbegin', 'dragging', 'like'])
</script>

<template>
  <div class="g-player-track">
    <div class="g-player-track__entity-cover">
      <g-thumbnail
        :current-music="props.currentMusic"
        :playing="props.playing"
        :enable-drag="props.enableDrag"
        :theme="props.theme"
        @toggleplay="$emit('toggleplay')"
        @dragbegin="$emit('dragbegin')"
        @dragging="$emit('dragging')"
      />
    </div>

    <div class="g-player-track__info">
      <div class="g-player-track__info-song-name">
        {{ currentMusic.title || 'Untitled' }}
      </div>

      <div v-if="$q.platform.is.desktop" class="g-player-track__info-artists">
        {{ currentMusic.artist || 'Unknown' }}
      </div>
    </div>

    <div v-if="$q.platform.is.desktop" class="g-player-track__action">
      <div class="g-player-track__action-like">
        <DynamicIcon name="heart" @click.prevent="emit('like')" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.g-player-track {
  display: flex;
  align-items: center;

  &__entity-cover {
    width: 56px;
    height: 56px;

    @media #{$mobile} {
      width: 48px;
      height: 48px;
    }
  }

  &__info {
    position: relative;
    margin: 0 0 0 12px;
    white-space: nowrap;

    @media #{$mobile} {
      margin: 0 0 0 16px;
    }

    &-song-name {
      font-size: $size-14;
      font-weight: 700;
      line-height: $lh-20;
      letter-spacing: 0.2px;
      color: $greyscale900;

      @media #{$mobile} {
        max-width: 190px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
    }

    &-artists {
      font-size: $size-14;
      font-weight: 600;
      line-height: $lh-20;
      letter-spacing: 0.2px;
      color: $greyscale500;
    }
  }

  &__action {
    margin: 0 0 0 16px;

    &-like {
      cursor: pointer;
      user-select: none;

      @include hover-supported {
        path {
          stroke: $primary;
        }
      }
    }
  }
}

body.body--dark {
  .g-player-track {
    &__info {
      &-song-name {
        color: $white;
      }
    }
  }
}
</style>
