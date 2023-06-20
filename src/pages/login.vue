<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'
import { useAlertStore, useAuthStore } from '@/stores'
import gInput from '@/components/gInput/gInput.vue'
import gBack from '@/components/gBack/gBack.vue'
import gSocial from '@/components/gSocial/gSocial.vue'
import { useTranslation } from '@/composables/lang'
import { useRouter } from 'vue-router'
import { useMeta } from 'quasar'

const { t } = useTranslation()
const router = useRouter()

defineComponent({
  components: {
    gInput,
    gBack,
    gSocial,
  },
})

const dense = ref<boolean>(false)

interface User {
  email: string
  password: string
  isLoading: boolean
  isDisabled: boolean
}

const data: User = reactive({
  email: '',
  password: '',
  isLoading: false,
  isDisabled: false,
})

useMeta(() => {
  return {
    title: t('pages.login.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.login.contentHead'),
      },
    },
  }
})

const onSubmit = async () => {
  const authStore = useAuthStore()

  try {
    data.isLoading = true
    await authStore.login(data.email, data.password)
    await router.push('/')
    data.isLoading = false
  } catch (error: unknown) {
    console.error(error)
    data.isLoading = false
    const alertStore = useAlertStore()
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}
</script>

<template>
  <div class="q-page g-login">
    <form class="g-login__form" @submit.prevent="onSubmit">
      <div class="q-page__header">
        <g-back
          :label="t('pages.login.buttonBackLogin')"
          href="/"
          icon="back"
        />
      </div>

      <h3 class="g-login__title">{{ t('pages.login.title') }}</h3>

      <div class="g-login__inputs">
        <g-input
          v-model="data.email"
          :dense="dense"
          :icon-class="'mail'"
          :placeholder="t('pages.login.emailPlaceholder')"
          :rules="[
            (val: string, rules: any) =>
              rules.email(val) || t('pages.login.emailValidDescription'),
          ]"
          class="g-login__inputs-label"
          standout
          type="email"
        />

        <g-input
          v-model="data.password"
          :dense="dense"
          :icon-class="'lock'"
          :placeholder="t('pages.login.passwordPlaceholder')"
          :rules="[
            (val: string) => val.length >= 6 || t('pages.login.passwordValidDescription'),
          ]"
          class="g-login__inputs-label"
          password
          standout
        />
      </div>

      <q-btn
        :disabled="data.isDisabled"
        :label="t('pages.login.buttonLogin')"
        :loading="data.isLoading"
        class="g-login__btn q-btn-large"
        rounded
        text-color="''"
        type="submit"
        unelevated
      />

      <router-link class="g-login__forgot g-link" to="/forgot-password">
        {{ t('pages.login.buttonForgotPassword') }}
      </router-link>

      <g-social class="g-login__social" />

      <div class="g-login__signup">
        {{ t('pages.login.signUpDescription') }}
        <router-link class="g-link" to="/register">
          {{ t('pages.login.buttonSignUp') }}
        </router-link>
      </div>
    </form>

    <div class="g-login__illustration" />
  </div>
</template>
