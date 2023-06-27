<script lang="ts" setup>
import { defineComponent, reactive } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import { useTranslation } from '@/composables/lang'
import { useMeta } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
  },
})

interface Notification {
  _id: string
  label: string
  info: string
}

interface Data {
  notification: Notification[]
}

const data: Data = reactive({
  notification: [
    {
      _id: '1',
      label: t('pages.notification.recommendedMusic'),
      info: t('pages.notification.recommendedMusicInfo'),
    },
    {
      _id: '2',
      label: t('pages.notification.newMusic'),
      info: t('pages.notification.newMusicInfo'),
    },
    {
      _id: '3',
      label: t('pages.notification.playlistUpdates'),
      info: t('pages.notification.playlistUpdatesInfo'),
    },
    {
      _id: '4',
      label: t('pages.notification.artistUpdates'),
      info: t('pages.notification.artistUpdatesInfo'),
    },
    {
      _id: '5',
      label: t('pages.notification.productNews'),
      info: t('pages.notification.productNewsInfo'),
    },
    {
      _id: '6',
      label: t('pages.notification.paymentsAndSubscriptions'),
      info: t('pages.notification.paymentsAndSubscriptionsInfo'),
    },
    {
      _id: '7',
      label: t('pages.notification.newFeatures'),
      info: t('pages.notification.newFeaturesInfo'),
    },
    {
      _id: '8',
      label: t('pages.notification.security'),
      info: t('pages.notification.securityInfo'),
    },
  ],
})

useMeta(() => {
  return {
    title: t('pages.notification.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.notification.contentHead'),
      },
    },
  }
})
</script>

<template>
  <div class="q-page">
    <div class="g-notification">
      <div class="g-notification__wrap">
        <g-back
          :label="t('pages.notification.buttonBackNotification')"
          href="/profile"
          icon="back"
        />

        <q-list class="g-notification__nav">
          <q-item
            v-for="item in data.notification"
            :key="item._id"
            class="g-notification__nav-item"
            clickable
          >
            <q-item-section>
              <p class="text-xl">
                {{ item.label }}
              </p>

              <p class="text-m">
                {{ item.info }}
              </p>
            </q-item-section>

            <q-item-section side>
              <DynamicIcon name="right" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>
