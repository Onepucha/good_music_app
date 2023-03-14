<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue'

interface Props {
  name: string
  path?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  path: '',
  size: 24,
})

const result = shallowRef(() => null)
const name = ref(props.name || '')

watch(
  () => props.name,
  (newName) => {
    name.value = newName
    result.value = defineAsyncComponent(promise)
  }
)

const dynamicSize = computed<number>(() => {
  return props.size
})

const promise: any = () => {
  switch (props.path) {
    case '':
      return import(`../assets/images/icons/${name.value}.svg`)
    case './':
      return import(`../assets/images/${name.value}.svg`)
  }
}

result.value = defineAsyncComponent(promise)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="dynamicSize"
    :height="dynamicSize"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="`g-icon g-icon-${name}`"
  >
    <keep-alive>
      <component
        :is="result"
        :class="`g-icon g-icon-${name}`"
        :size="dynamicSize"
      />
    </keep-alive>
  </svg>
</template>
