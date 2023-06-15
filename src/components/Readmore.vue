<script setup lang="ts">
import { computed, ref } from 'vue'

const readMoreActivated = ref<boolean>(false)

const props = defineProps<{
  longText: string
  slice?: number
}>()

const activateReadMore = () => {
  readMoreActivated.value = true
}

const textLength = computed<boolean>(() => {
  return props.longText.length > (props.slice ?? 200)
})
</script>

<template>
  <div class="g-readmore">
    <span v-if="!readMoreActivated">
      {{ props.longText.slice(0, props.slice || 200) }}
    </span>
    <span
      v-if="!readMoreActivated && textLength"
      class="g-link"
      @click.prevent="activateReadMore"
    >
      view more...
    </span>
    <span v-if="readMoreActivated" v-html="props.longText"></span>
  </div>
</template>
