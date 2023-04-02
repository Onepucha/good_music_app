<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import { defineComponent } from 'vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const props = defineProps<{
  label: string
  recently: string
}>()

const emit = defineEmits(['recently'])

const onRecently = () => {
  emit('recently')
}
</script>

<template>
  <div class="g-music-filtered">
    <div class="g-music-filtered__label">
      {{ props.label }}
    </div>

    <div
      v-if="props.recently"
      class="g-music-filtered__recently"
      @click.prevent="onRecently"
    >
      <span>{{ props.recently }}</span>
      <DynamicIcon name="recently" :size="20" />
    </div>
  </div>
</template>

<style scoped></style>
