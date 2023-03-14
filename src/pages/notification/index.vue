<script lang="ts" setup>
import { defineComponent, reactive } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
  },
})

interface Notification {
  label: string
  info: string
}

interface Data {
  notification: Notification[]
}

const data: Data = reactive({
  notification: [
    {
      label: t('pages.notification.recommendedMusic'),
      info: t('pages.notification.recommendedMusicInfo'),
    },
    {
      label: t('pages.notification.newMusic'),
      info: t('pages.notification.newMusicInfo'),
    },
    {
      label: t('pages.notification.playlistUpdates'),
      info: t('pages.notification.playlistUpdatesInfo'),
    },
    {
      label: t('pages.notification.artistUpdates'),
      info: t('pages.notification.artistUpdatesInfo'),
    },
    {
      label: t('pages.notification.productNews'),
      info: t('pages.notification.productNewsInfo'),
    },
    {
      label: t('pages.notification.paymentsAndSubscriptions'),
      info: t('pages.notification.paymentsAndSubscriptionsInfo'),
    },
    {
      label: t('pages.notification.newFeatures'),
      info: t('pages.notification.newFeaturesInfo'),
    },
    {
      label: t('pages.notification.security'),
      info: t('pages.notification.securityInfo'),
    },
  ],
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
            v-for="(item, index) in data.notification"
            :key="index"
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

<route lang="yaml">
meta:
layout: default
</route>
