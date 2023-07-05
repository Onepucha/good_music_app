<script lang="ts" setup>
import { computed, defineComponent } from 'vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

interface Props {
  playing: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  playing: false,
  loading: false,
})

const iconPlayOrPause = computed<string>(() => {
  if (props.loading) {
    return 'loading'
  } else if (props.playing) {
    return 'pause'
  } else {
    return 'play'
  }
})
</script>

<template>
  <div class="g-play-btn">
    <DynamicIcon :size="16" :name="iconPlayOrPause" />
  </div>
</template>

<style scoped></style>
