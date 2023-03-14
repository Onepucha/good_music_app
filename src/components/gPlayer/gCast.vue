<script setup lang="ts">
import { useQuasar } from 'quasar'
import { defineComponent, reactive } from 'vue'

import gControllerVolume from './gControllerVolume.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    gControllerVolume,
    DynamicIcon,
  },
})

const props = defineProps<{
  shuffle?: boolean
  repeat?: string
  theme?: string
  volume: number
  muted: boolean
  hasMenu?: boolean
}>()

const $q = useQuasar()

interface Data {
  isMobile: boolean
}

const data: Data = reactive({
  isMobile: $q.screen.name === 'xs',
})

const emit = defineEmits([
  'togglemute',
  'setvolume',
  'toggleshuffle',
  'nextmode',
  'togglelist',
])
</script>

<template>
  <div class="g-player-track-cast">
    <g-controller-volume
      v-if="!data.isMobile"
      :volume="props.volume"
      :theme="props.theme"
      :muted="props.muted"
      @togglemute="emit('togglemute')"
      @setvolume="(v) => emit('setvolume', v)"
    />
    <DynamicIcon
      class="g-player-icon-mode"
      name="shuffle-player"
      :class="{ inactive: !props.shuffle }"
      @click.prevent="emit('toggleshuffle')"
    />
    <DynamicIcon
      class="g-player-icon-mode"
      :name="props.repeat === 'repeat-one' ? 'repeat-one' : 'repeat-all'"
      :class="{ inactive: props.repeat === 'no-repeat' }"
      @click.prevent="emit('nextmode')"
    />
    <DynamicIcon
      v-if="props.hasMenu"
      class="g-player-icon-menu"
      name="menu"
      @click.prevent="emit('togglelist')"
    />
  </div>
</template>

<style lang="scss">
.g-player-track-cast {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  .g-icon {
    cursor: pointer;

    &-shuffle-player,
    &-repeat-all,
    &-menu {
      path {
        fill: $greyscale500;
      }

      @include hover-supported {
        path {
          fill: $primary;
        }
      }
    }
  }
}
</style>
