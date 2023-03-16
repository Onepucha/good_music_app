<script lang="ts" setup>
import { email, required } from '@vuelidate/validators'

import { computed, defineComponent, reactive, ref } from 'vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gInput from '@/components/gInput/gInput.vue'

import BgForgotPassword from '@/assets/images/bg_forgot_password.png'
import { useVuelidate } from '@vuelidate/core'
import { useTranslation } from '@/composables/lang'
import { useAlertStore, useUsersStore } from '@/stores'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gInput,
  },
})

interface Data {
  email: string
  isLoading: boolean
}

const data: Data = reactive({
  email: '',
  isLoading: false,
})

const dense = ref<boolean>(false)

const rules = computed(() => {
  return {
    email: { required, email },
  }
})

const v$ = useVuelidate(rules, data)

const isButtonSendDisabled = computed<boolean>(() => {
  return v$.value.email.$invalid
})

const sendCode = async () => {
  const usersStore = useUsersStore()
  const alertStore = useAlertStore()

  try {
    data.isLoading = true

    await usersStore.sendCode({ email: data.email })

    alertStore.success('Successfully!')
    data.isLoading = false
  } catch (error: unknown) {
    console.error(error)
    data.isLoading = false
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}
</script>

<template>
  <div class="q-page g-forgot-password">
    <form class="g-forgot-password__form" @submit.prevent="sendCode">
      <g-back
        :label="t('pages.forgot-password.buttonBackForgotPassword')"
        href="/login"
        icon="back"
      />

      <div class="g-forgot-password__picture">
        <img
          :alt="t('pages.forgot-password.bgForgotPasswordAlt')"
          :src="BgForgotPassword"
        />
      </div>

      <div class="g-forgot-password__description">
        <p class="text-xl">
          {{ t('pages.forgot-password.descriptionStep') }}
        </p>
      </div>

      <q-card class="g-forgot-password__card">
        <q-card-section>
          <div class="g-forgot-password__card-picture">
            <DynamicIcon name="message" />
          </div>

          <div class="g-forgot-password__info">
            <p class="g-forgot-password__info-label">
              {{ t('pages.forgot-password.infoLabel') }}
            </p>
            <g-input
              v-model="data.email"
              :dense="dense"
              :icon-class="'mail'"
              :placeholder="t('pages.login.emailPlaceholder')"
              :rules="[
            (val: string, rules: any) =>
              rules.email(val) || t('pages.login.emailValidDescription'),
          ]"
              class="g-forgot-password__info-chose"
              standout
              type="email"
            />
          </div>
        </q-card-section>
      </q-card>

      <div class="g-forgot-password__action">
        <q-btn
          :disabled="isButtonSendDisabled"
          :label="t('pages.forgot-password.buttonContinue')"
          :loading="data.isLoading"
          class="g-register__btn q-btn-large"
          rounded
          text-color="''"
          unelevated
          @click.prevent="sendCode"
        />
      </div>
    </form>
  </div>
</template>
