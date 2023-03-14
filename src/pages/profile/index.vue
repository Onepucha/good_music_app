<script lang="ts" setup>
import { computed, defineComponent, reactive, ref } from 'vue'

import { useAuthStore } from '@/stores'
import { useTranslation } from '@/composables/lang'
import { allLocales } from '@/../i18n'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gCardPremium from '@/components/gCardPremium/gCardPremium.vue'
import gDisplayer from '@/components/gCropper/gDisplayer.vue'
import { useQuasar } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gCardPremium,
    gDisplayer,
  },
})

const authStore = useAuthStore()
const $q = useQuasar()

interface Image {
  src: string
  type: string
}

interface Data {
  theme: any
  image: Image
}

const data: Data = reactive({
  theme: false,
  image: {
    src: 'https://images.unsplash.com/photo-1619737307100-55b82496fcda?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    type: 'image/jpg',
  },
})

const dialog = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')

if (localStorage.getItem('darkMode')) {
  data.theme = JSON.parse(localStorage.getItem('darkMode') as string)
  $q.dark.set(data.theme)
} else {
  data.theme = $q.dark.isActive
}
const authUser = computed<any>(() => authStore.user)
const currentLocale = computed<any>(
  () =>
    allLocales.filter(
      (locale) => locale.value === authUser.value?.language_descriptor
    )[0]
)

const toggleDarkMode = () => {
  localStorage.setItem('darkMode', data.theme)
  $q.dark.toggle()
}

const openLogout = (pos: string) => {
  position.value = pos
  dialog.value = true
}

const logout = async () => {
  try {
    isLoading.value = true
    await authStore.logout()
    isLoading.value = false
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
  }
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12">
        <div class="g-profile">
          <div class="g-profile__wrap">
            <div class="q-page__header">
              <div class="q-page__header-title">
                <i class="g-icon g-icon-logo"></i>
                <h4>{{ t('pages.profile.titleHeader') }}</h4>
              </div>

              <div class="q-page__header-dropdown">
                <i class="g-icon g-icon-dropdown-menu">
                  <span></span>
                </i>
              </div>
            </div>

            <div class="g-profile__body">
              <div class="g-profile__top-line">
                <div class="g-profile__account">
                  <g-displayer />

                  <div v-if="authUser" class="g-profile__account-details">
                    <h5>{{ authUser.fullname }}</h5>
                    <p class="text-m">{{ authUser.email }}</p>
                  </div>
                </div>

                <g-card-premium class="g-profile__card" />
              </div>

              <q-list class="g-profile__nav">
                <q-item to="/profile/details">
                  <q-item-section avatar>
                    <DynamicIcon :size="28" name="profile" />
                  </q-item-section>

                  <q-item-section>
                    {{ t('pages.profile.navs.profile') }}
                  </q-item-section>

                  <q-item-section side>
                    <DynamicIcon :size="28" name="right" />
                  </q-item-section>
                </q-item>

                <q-item to="/notification">
                  <q-item-section avatar>
                    <DynamicIcon :size="28" name="notification" />
                  </q-item-section>

                  <q-item-section>
                    {{ t('pages.profile.navs.notification') }}
                  </q-item-section>

                  <q-item-section side>
                    <DynamicIcon :size="28" name="right" />
                  </q-item-section>
                </q-item>

                <q-item to="/security">
                  <q-item-section avatar>
                    <DynamicIcon :size="28" name="security" />
                  </q-item-section>

                  <q-item-section
                    >{{ t('pages.profile.navs.security') }}
                  </q-item-section>

                  <q-item-section side>
                    <DynamicIcon :size="28" name="right" />
                  </q-item-section>
                </q-item>

                <q-item to="/language">
                  <q-item-section avatar>
                    <DynamicIcon :size="28" name="language" />
                  </q-item-section>

                  <q-item-section>
                    {{ t('pages.profile.navs.language') }}
                  </q-item-section>

                  <q-item-section side>
                    {{ currentLocale?.label }}
                  </q-item-section>

                  <q-item-section side>
                    <DynamicIcon :size="28" name="right" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <DynamicIcon :size="28" name="theme" />
                  </q-item-section>

                  <q-item-section>
                    {{ t('pages.profile.navs.darkMode') }}
                  </q-item-section>

                  <q-item-section side>
                    <q-toggle
                      v-model="data.theme"
                      @update:model-value="toggleDarkMode"
                    />
                  </q-item-section>
                </q-item>

                <q-item clickable @click.prevent="openLogout('bottom')">
                  <q-item-section avatar>
                    <DynamicIcon :size="28" name="logout" />
                  </q-item-section>

                  <q-item-section
                    >{{ t('pages.profile.navs.logout') }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog
    ref="qDialogPopup"
    v-model="dialog"
    :position="position"
    class="g-popup-profile"
  >
    <q-card>
      <q-card-section class="g-popup-profile__body text-center">
        <h4>{{ t('pages.profile.popup.title') }}</h4>
        <h5>
          {{ t('pages.profile.popup.description') }}
        </h5>
        <div class="g-popup-profile__action">
          <q-btn
            v-close-popup
            :label="t('pages.profile.popup.buttonCancel')"
            class="g-popup-profile__btn q-btn--light-primary q-btn-large"
            rounded
            text-color="''"
            unelevated
          />

          <q-btn
            :label="t('pages.profile.popup.buttonConfirm')"
            :loading="isLoading"
            class="g-popup-profile__btn q-btn-large"
            rounded
            text-color="''"
            unelevated
            @click.prevent="logout"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<route lang="yaml">
meta:
layout: default
</route>
