<script setup lang="ts">
import { defineComponent } from 'vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { Payment } from '@/types/options'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const props = defineProps<{
  payment: Payment
}>()
</script>

<template>
  <q-item tag="label" clickable class="g-payment-methods__wrap">
    <div class="g-payment-methods__chose">
      <div class="g-payment-methods__chose-payments">
        <DynamicIcon :size="32" :name="props.payment.value" />
      </div>
      <div class="g-payment-methods__chose-name">
        {{ props.payment.label }}
      </div>
    </div>

    <slot name="radio" />
  </q-item>
</template>

<style scoped></style>
