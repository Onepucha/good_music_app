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

interface Data {
  rememberMe: any
}

const data: Data = reactive({
  rememberMe: false,
})

const toggleRememberMe = () => {
  console.log('Remember me')
}
</script>

<template>
  <div class="q-page">
    <div class="g-security">
      <div class="g-security__wrap">
        <g-back
          :label="t('pages.security.buttonBackSecurity')"
          href="/profile"
          icon="back"
        />

        <q-list class="g-security__nav">
          <q-item>
            <q-item-section>
              {{ t('pages.security.rememberMe') }}
            </q-item-section>

            <q-item-section side>
              <q-toggle
                v-model="data.rememberMe"
                @click.prevent="toggleRememberMe"
              />
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section>
              {{ t('pages.security.googleAuthenticator') }}
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
