<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'
import { defineComponent, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores'

import DynamicIcon from '@/components/DynamicIcon.vue'
import { useMeta } from 'quasar'

const { t } = useTranslation()
const authStore = useAuthStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

interface Data {
  volume: number
  muted: boolean
}

const data: Data = reactive({
  volume: 1,
  muted: false,
})

useMeta(() => {
  return {
    title: t('pages.library.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.library.contentHead'),
      },
    },
  }
})

const payment = ref<string>('')

const openSearch = () => {
  authStore.searchModal = true
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="g-library">
          <div class="q-page__header">
            <q-item class="q-page__header-title" to="/">
              <i class="g-icon g-icon-logo"></i>
              <h4>{{ t('pages.library.titleHeader') }}</h4>
            </q-item>

            <div class="q-page__header-actions">
              <DynamicIcon
                name="search"
                :size="28"
                @click.prevent="openSearch"
              />

              <div class="q-page__header-dropdown">
                <i class="g-icon g-icon-dropdown-menu">
                  <span></span>
                </i>
              </div>
            </div>
          </div>

          <q-list class="g-library__nav">
            <q-item :to="`/library/${authStore.user?.nickname}/playlists`">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="playlists" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.playlists') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item :to="`/library/${authStore.user?.nickname}/downloads`">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="downloads" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.downloads') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item :to="`/library/${authStore.user?.nickname}/albums`">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="albums" />
              </q-item-section>

              <q-item-section
                >{{ t('pages.library.navs.albums') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item :to="`/library/${authStore.user?.nickname}/songs`">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="songs" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.songs') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item :to="`/library/${authStore.user?.nickname}/artists`">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="artists" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.artists') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </div>
</template>
