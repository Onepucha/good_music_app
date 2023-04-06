<script lang="ts" setup>
import { defineComponent, reactive } from 'vue'
import { useAlertStore, useAuthStore } from '@/stores'
import { allLocales } from '@/boot/i18n'

import gBack from '@/components/gBack/gBack.vue'
import { useTranslation } from '@/composables/lang'

const { t, locale } = useTranslation()
const authStore = useAuthStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    gBack,
  },
})

interface Data {
  lang: string
}

const data: Data = reactive({
  lang: locale,
})

const setUserLocale = async (item: {
  title?: string
  label?: string
  value?: string
}) => {
  let lang = item.value || 'en'

  try {
    await authStore.setProfile({ language_descriptor: lang })
    authStore.setLocale(lang)
    alertStore.success(t('success'))
  } catch (error: unknown) {
    console.error(error)
    alertStore.error(t('error'))
  }
}
</script>

<template>
  <div class="q-page">
    <div class="g-language">
      <div class="g-language__wrap">
        <g-back
          :label="t('pages.language.buttonBackLanguage')"
          href="/profile"
          icon="back"
        />

        <q-list class="g-language__list">
          <q-item
            v-for="(item, index) in allLocales"
            :key="index"
            :tag="!item.title ? 'label' : ''"
            @click="setUserLocale(item)"
          >
            <template v-if="item.title">
              <h5>{{ item.title }}</h5>
            </template>

            <template v-if="!item.title">
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-radio v-model="data.lang" :val="item.value" />
              </q-item-section>
            </template>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>
