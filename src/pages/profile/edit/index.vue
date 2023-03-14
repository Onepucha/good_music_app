<script lang="ts" setup>
import { computed, defineComponent, reactive, ref } from 'vue'
import dayjs from 'dayjs'

import { useTranslation } from '@/composables/lang'
import { email, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useAlertStore, useAuthStore } from '@/stores'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gInput from '@/components/gInput/gInput.vue'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gInput,
  },
})

const authStore = useAuthStore()
const dense = ref<boolean>(false)
const qDateProxy = ref<any>(null)

interface Data {
  email: string
  fullname: string
  nickname: string
  dob: string
  avatar: string
  gender: string
  options: Array<string>
  isLoading: boolean
  isDisabled: boolean
  datepickerTheme: boolean
}

const data: Data = reactive({
  email: authStore?.user?.email || '',
  fullname: authStore?.user?.fullname || '',
  nickname: authStore?.user?.nickname || '',
  dob: dayjs(authStore?.user?.birth_date).format('DD/MM/YYYY') || '',
  avatar: authStore?.user?.avatar || '',
  gender: authStore?.user?.gender || '',
  isLoading: false,
  isDisabled: false,
  options: ['Male', 'Female'],
  datepickerTheme: false,
})

const rules = computed(() => {
  return {
    email: { required, email },
    fullname: { required, minLength: minLength(6) },
    nickname: { required, minLength: minLength(6) },
    dob: { required, minLength: minLength(6) },
  }
})

const v$ = useVuelidate(rules, data)

data.datepickerTheme = !!JSON.parse(localStorage.getItem('darkMode') as string)

const onSaveProfile = async () => {
  const authStore = useAuthStore()
  const alertStore = useAlertStore()

  v$.value.$validate()

  if (!v$.value.$error) {
    try {
      data.isLoading = true
      let dob: Date | string = dayjs(data.dob).format('YYYY-DD-MM')

      await authStore.setProfile(
        data.avatar,
        data.fullname,
        data.nickname,
        new Date(dob),
        data.gender
      )

      data.isLoading = false
    } catch (error: unknown) {
      console.error(error)
      data.isLoading = false
      if (error instanceof Error) {
        alertStore.error(error.message)
      }
    }
  }
}
</script>

<template>
  <div class="q-page">
    <div class="g-profile-edit">
      <div class="g-profile-edit__wrap">
        <div class="q-page__header">
          <g-back
            :label="t('pages.profile.edit.buttonBackProfileEdit')"
            href="/profile/details"
            icon="back"
          />
        </div>

        <div class="g-profile-edit__form">
          <div class="g-profile-edit__inputs">
            <g-input
              v-model="data.fullname"
              :dense="dense"
              :placeholder="t('pages.profile.edit.fullNamePlaceholder')"
              :rules="[
            (val: string) => val.length >= 6 || t('pages.profile.edit.fullNameValidDescription'),
          ]"
              class="g-profile-edit__inputs-label"
              standout
              type="text"
            />

            <g-input
              v-model="data.nickname"
              :dense="dense"
              :placeholder="t('pages.profile.edit.nickNamePlaceholder')"
              :rules="[
            (val: string) => val.length >= 6 || t('pages.profile.edit.nickNameValidDescription'),
          ]"
              class="g-profile-edit__inputs-label"
              standout
              type="text"
            />

            <div class="g-input g-profile-edit__inputs-label">
              <q-input
                v-model="data.dob"
                :dense="dense"
                :icon-class="'calendar'"
                :placeholder="t('pages.profile.edit.dobPlaceholder')"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    t('pages.profile.edit.dobValidDescription'),
                ]"
                mask="##/##/####"
                standout
                @click="qDateProxy.show()"
              >
                <template #append>
                  <DynamicIcon :size="20" name="calendar" />
                  <q-popup-proxy
                    ref="qDateProxy"
                    :breakpoint="0"
                    behavior="menu"
                  >
                    <q-date
                      v-model="data.dob"
                      :dark="data.datepickerTheme"
                      mask="DD/MM/YYYY"
                      navigation-min-year-month="1924/01"
                      navigation-max-year-month="2005/01"
                      minimal
                      no-unset
                      @update:model-value="qDateProxy.hide()"
                    ></q-date>
                  </q-popup-proxy>
                </template>
              </q-input>
            </div>

            <g-input
              v-model="data.email"
              :dense="dense"
              :placeholder="t('pages.profile.edit.emailPlaceholder')"
              :rules="[
            (val: string, rules: any) =>
              rules.email(val) || t('pages.profile.edit.emailValidDescription'),
          ]"
              class="g-register__inputs-label"
              standout
              type="email"
            >
              <template #append>
                <DynamicIcon :size="20" name="email_verify" />
              </template>
            </g-input>

            <q-select
              v-model="data.gender"
              :label="t('pages.profile.edit.genderLabel')"
              :options="data.options"
              outlined
            />
          </div>
        </div>
      </div>
    </div>
    <div class="g-action-button__bottom">
      <q-btn
        :label="t('pages.profile.edit.buttonUpdate')"
        :loading="data.isLoading"
        class="q-btn-large"
        rounded
        text-color="''"
        unelevated
        @click.prevent="onSaveProfile"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
layout: default
</route>
