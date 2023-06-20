<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import gBack from '@/components/gBack/gBack.vue'
import gMusicSubscribe from '@/components/gMusicSubscribe/gMusicSubscribe.vue'
import { useTranslation } from '@/composables/lang'
import { useMeta } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    gBack,
    gMusicSubscribe,
  },
})

const items = ref([
  {
    _id: 1,
    href: '#',
    price: '$9.99',
    quantityMonths: '/months',
    list: [
      'Listening with better audio quality',
      'Listening without restrictions & ads',
      'Shuffle play & download unlimited',
    ],
  },
  {
    _id: 2,
    href: '#',
    price: '$19.99',
    quantityMonths: '/3 months',
    list: [
      'Listening with better audio quality',
      'Listening without restrictions & ads',
      'Shuffle play & download unlimited',
    ],
  },
  {
    _id: 3,
    href: '#',
    price: '$49.99',
    quantityMonths: '/6 months',
    list: [
      'Listening with better audio quality',
      'Listening without restrictions & ads',
      'Shuffle play & download unlimited',
    ],
  },
])

useMeta(() => {
  return {
    title: t('pages.premium.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.premium.contentHead'),
      },
    },
  }
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

            <p class="text-l text-center">
              Enjoy listening songs & podcast with better audio quality, without
              restrictions, and without ads.
            </p>
          </div>

          <div class="g-music-subscribe__items">
            <g-music-subscribe
              v-for="item in items"
              :key="item._id"
              :item="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
