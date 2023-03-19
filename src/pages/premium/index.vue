<script lang="ts" setup>
import { defineComponent } from 'vue'
import gBack from '@/components/gBack/gBack.vue'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
  },
})
</script>

<template>
  <div class="q-page q-page-payment">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="q-page__header">
          <g-back icon="back" @click.prevent="$router.go(-1)" />
        </div>

        <div class="q-page-payment__body">
          <div class="q-page-payment__body-top">
            <h3 class="text-primary text-center">Subscribe to Premium</h3>

            <p class="text-l">
              Enjoy listening songs & podcast with better audio quality, without
              restrictions, and without ads.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
