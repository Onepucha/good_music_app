<script lang="ts" setup>
import { defineComponent, computed } from 'vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})
interface Props {
  playing: boolean
}

const props = withDefaults(defineProps<Props>(), {
  playing: false,
})

// const playing = ref<boolean>(false)

// const togglePlay = () => {
//   props.playing = !props.playing
// }

const iconPlayOrPause = computed<string>(() =>
  props.playing ? 'pause' : 'play'
)
</script>

<template>
  <div class="g-play-btn">
    <DynamicIcon :size="16" :name="iconPlayOrPause" />
  </div>
</template>

<style scoped></style>
