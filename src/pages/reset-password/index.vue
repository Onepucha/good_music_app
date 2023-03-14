<script lang="ts" setup>
import { minLength, required, sameAs } from '@vuelidate/validators'

import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import gBack from '@/components/gBack/gBack.vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gInput from '@/components/gInput/gInput.vue'
import gCheckbox from '@/components/gCheckbox/gCheckbox.vue'

import BgNewPassword from '@/assets/images/bg_create_new_password.png'
import Congratulations from '@/assets/images/congratulations.png'
import { useVuelidate } from '@vuelidate/core'
import { useRoute, useRouter } from 'vue-router'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, useUsersStore } from '@/stores'

const { t } = useTranslation()
const router = useRouter()

defineComponent({
  components: {
    gBack,
    gLoader,
    gInput,
    gCheckbox,
  },
})

interface Data {
  password: string
  confirmPassword: string
  token: string
  rememberMe: boolean
  isLoading: boolean
}

const data: Data = reactive({
  password: '',
  confirmPassword: '',
  token: '',
  rememberMe: false,
  isLoading: false,
})

const route = useRoute()

onMounted(() => {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  if (
    route.query.token === params.token &&
    typeof params.token !== 'undefined'
  ) {
    data.token = route.query.token
  }
})

const dense = ref<boolean>(false)
const confirm = ref<boolean>(false)
const qDialogPopup = ref<any>(null)

const rules = computed(() => {
  return {
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, sameAs: sameAs(data.password) },
  }
})

const v$ = useVuelidate(rules, data)

const isDisabledButton = computed<boolean>(() => {
  return v$.value.$invalid
})

const changePassword = async () => {
  const usersStore = useUsersStore()
  const alertStore = useAlertStore()

  try {
    data.isLoading = true

    await usersStore.changePassword(data.password, data.token)

    openModalCongratulations()
    data.isLoading = false
  } catch (error: unknown) {
    console.error(error)
    data.isLoading = false
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const openModalCongratulations = () => {
  confirm.value = true

  setTimeout(() => {
    qDialogPopup.value.hide()
    router.push('/login')
  }, 3000)
}
</script>

<template>
  <div class="g-forgot-password">
    <form class="g-forgot-password__form" @submit.prevent="changePassword">
      <g-back
        icon="back"
        :label="t('pages.reset-password.buttonBackResetPassword')"
        href="/login"
      />

      <div
        class="g-forgot-password__picture g-forgot-password__picture-new-password"
      >
        <img
          :alt="t('pages.reset-password.bgNewPasswordAlt')"
          :src="BgNewPassword"
        />
      </div>

      <div class="g-forgot-password__description">
        <p class="text-xl">
          {{ t('pages.reset-password.descriptionStepTwo') }}
        </p>
      </div>

      <div class="g-forgot-password__inputs">
        <g-input
          v-model="data.password"
          :dense="dense"
          :icon-class="'lock'"
          :placeholder="t('pages.reset-password.passwordPlaceholder')"
          :rules="[
            (val: string) => val.length >= 6 || t('pages.reset-password.passwordValidDescription'),
          ]"
          class="g-forgot-password__inputs-label"
          password
          standout
        />

        <g-input
          v-model="data.confirmPassword"
          :dense="dense"
          :icon-class="'lock'"
          :placeholder="t('pages.reset-password.confirmPasswordPlaceholder')"
          :rules="[
            (val: string) => val.length >= 6 || t('pages.reset-password.passwordValidDescription'),
          ]"
          class="g-forgot-password__inputs-label"
          password
          standout
        />
      </div>

      <div class="g-forgot-password__checkbox">
        <g-checkbox v-model="data.rememberMe"
          >{{ t('pages.reset-password.rememberMe') }}
        </g-checkbox>
      </div>

      <div class="g-forgot-password__action">
        <q-btn
          :disabled="isDisabledButton"
          :label="t('pages.reset-password.buttonContinue')"
          class="g-register__btn q-btn-large"
          rounded
          text-color="''"
          unelevated
          @click="changePassword"
        />
      </div>

      <q-dialog
        ref="qDialogPopup"
        v-model="confirm"
        class="g-popup-forgot-password"
      >
        <q-card>
          <q-card-section class="g-popup-forgot-password__body text-center">
            <div class="g-popup-forgot-password__picture">
              <img
                :alt="t('pages.reset-password.congratulationsAlt')"
                :src="Congratulations"
              />
            </div>
            <h4>{{ t('pages.reset-password.congratulationsTitle') }}</h4>
            <p class="text-l">
              {{ t('pages.reset-password.congratulationsDescription') }}
            </p>
            <g-loader />
          </q-card-section>
        </q-card>
      </q-dialog>
    </form>
  </div>
</template>

<route lang="yaml">
meta:
layout: simple
</route>
