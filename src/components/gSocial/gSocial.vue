<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'
import { defineComponent } from 'vue'
import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const { t } = useTranslation()
</script>

<template>
  <div class="g-social">
    <div class="g-social__separator">
      <span>{{ t('social.separator') }}</span>
    </div>

    <div class="g-social__links">
      <div class="g-social__links-item">
        <DynamicIcon name="facebook" />
      </div>
      <div class="g-social__links-item">
        <DynamicIcon name="google" />
      </div>
      <div class="g-social__links-item">
        <DynamicIcon name="apple" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
