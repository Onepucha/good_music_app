<script lang="ts" setup>
import { defineComponent } from 'vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const props = defineProps<{
  href?: string
  label?: string
  icon: string
}>()

const emit = defineEmits(['click-handler'])

const clickHandler = (event: any) => {
  emit('click-handler', event.target.value)
}
</script>

<template>
  <router-link v-if="props.href" :to="props.href" class="g-back">
    <DynamicIcon :name="props.icon" />
    <span>{{ props.label }}</span>
  </router-link>

  <div v-else class="g-back" @click="clickHandler">
    <DynamicIcon :name="props.icon" />
    <span>{{ props.label }}</span>
  </div>
</template>

<style scoped></style>
