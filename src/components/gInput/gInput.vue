<script lang="ts" setup>
import { defineComponent, ref, computed } from 'vue'
import type { QInputSlots } from 'quasar'
import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})
const props = defineProps<{
  icon?: string
  iconClass?: string
  password?: boolean
  type?: string
}>()

const emit = defineEmits(['focus', 'blur'])

const text = ref<string>('')
const isPassword = ref<boolean>(true)
const focus = ref<boolean>(false)

// Computed
const iconPassword = computed<string>(() => {
  return props.password && isPassword.value ? 'visibility_off' : 'visibility'
})

// Methods
const onFocus = () => {
  focus.value = true
  emit('focus', focus.value)
}

const onBlur = () => {
  focus.value = false
  emit('blur', focus.value)
}
</script>

<template>
  <div class="g-input">
    <q-input
      v-model="text"
      :type="
        isPassword && props.password
          ? 'password'
          : props?.type
          ? props.type
          : 'text'
      "
      class="g-input"
      v-bind="$attrs"
      @blur="onBlur"
      @focus="onFocus"
    >
      <template
        v-for="(_, slot) in ($slots as Readonly<QInputSlots>)"
        #[slot]="scope"
      >
        <slot :name="slot" v-bind="scope || {}" />
      </template>

      <template v-if="props.icon || props.iconClass" #prepend>
        <DynamicIcon :name="props.iconClass" />
      </template>

      <template v-if="props.password" #append>
        <DynamicIcon :name="iconPassword" @click="isPassword = !isPassword" />
      </template>
    </q-input>
  </div>
</template>

<style scoped></style>
