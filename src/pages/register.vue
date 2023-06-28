<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useAlertStore, useAuthStore, useUsersStore } from '@/stores'
import { useVuelidate } from '@vuelidate/core'
import { email, minLength, required, sameAs } from '@vuelidate/validators'
import { useRouter } from 'vue-router'
import { Artist } from '@/types/artist'

import dayjs from 'dayjs'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gInput from '@/components/gInput/gInput.vue'
import gBack from '@/components/gBack/gBack.vue'
import gCheckbox from '@/components/gCheckbox/gCheckbox.vue'
import gSocial from '@/components/gSocial/gSocial.vue'
import gFollowArtist from '@/components/gFollowArtist/gFollowArtist.vue'
import gDisplayer from '@/components/gCropper/gDisplayer.vue'

import { useArtistsStore } from '@/stores/artists.store'
import { useTranslation } from '@/composables/lang'
import { useMeta } from 'quasar'

const { t } = useTranslation()
const router = useRouter()

defineComponent({
  components: {
    DynamicIcon,
    gInput,
    gCheckbox,
    gBack,
    gSocial,
    gFollowArtist,
    gDisplayer,
  },
})

const dense = ref<boolean>(false)
// const gender = ref<string | null>(null)
const step = ref(0)
const qDateProxy = ref<any>(null)

interface Data {
  email: string
  password: string
  fullname: string
  nickname: string
  dob: string
  gender: string
  avatar: string
  genders: Array<string>
  valueTerms: boolean
  isLoading: boolean
  isDisabled: boolean
  showing: boolean
  artistList: Array<Artist>
  followArtistList: string[] | any
}

const data: Data = reactive({
  email: '',
  password: '',
  fullname: '',
  nickname: '',
  dob: '',
  gender: '',
  avatar: '',
  genders: ['Male', 'Female'],
  isLoading: false,
  isDisabled: false,
  valueTerms: false,
  showing: false,
  artistList: [],
  followArtistList: [],
})

useMeta(() => {
  return {
    title: t('pages.register.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.register.contentHead'),
      },
    },
  }
})

const rules = computed(() => {
  return {
    email: { required, email },
    password: { required, minLength: minLength(6) },
    valueTerms: { sameAs: sameAs(true) },
    fullname: { required, minLength: minLength(6) },
    nickname: { required, minLength: minLength(6) },
    dob: { required, minLength: minLength(6) },
    gender: { required },
  }
})

const isDisabledButton = computed<boolean>(() => {
  let valid = true

  if (
    step.value === 0 &&
    !v$.value.email.$invalid &&
    !v$.value.password.$invalid &&
    !v$.value.valueTerms.$invalid
  ) {
    valid = false
  } else if (
    step.value === 1 &&
    !v$.value.fullname.$invalid &&
    !v$.value.nickname.$invalid &&
    !v$.value.dob.$invalid
  ) {
    valid = false
  } else if (step.value === 2) {
    valid = false
  }

  return valid
})

const v$ = useVuelidate(rules, data)

const prevStep = () => {
  if (step.value === 0) step.value = 0
  step.value--
}

const nextStep = () => {
  step.value++
}

const onSubmit = async () => {
  const usersStore = useUsersStore()
  const alertStore = useAlertStore()
  const authStore = useAuthStore()

  if (!v$.value.$error) {
    try {
      data.isLoading = true

      await usersStore.register({
        email: data.email,
        password: data.password,
        read_terms: data.valueTerms,
      })

      await authStore.login(data.email, data.password)

      data.isLoading = false
      nextStep()
      //
      // alertStore.success('Registration successful')
    } catch (error: unknown) {
      console.error(error)
      data.isLoading = false
      if (error instanceof Error) {
        alertStore.error(error.message)
      }
    }
  }
}

const onSaveProfile = async () => {
  const authStore = useAuthStore()
  const alertStore = useAlertStore()

  try {
    data.isLoading = true
    let dob: Date | string = dayjs(data.dob).format('YYYY-DD-MM')

    await authStore.setProfile({
      fullname: data.fullname,
      nickname: data.nickname,
      birth_date: new Date(dob),
      gender: data.gender,
    })

    data.isLoading = false
    nextStep()
  } catch (error: unknown) {
    console.error(error)
    data.isLoading = false
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const addFollow = (artist: any) => {
  const isFollowItem = data.followArtistList.filter(
    (item: any) => item._id === artist?._id
  )

  if (isFollowItem.length) {
    data.followArtistList = data.followArtistList.filter(
      (item: any) => item._id !== artist._id
    )
  } else {
    const followItem = data.artistList.filter(
      (item: any) => item._id === artist._id
    )

    data.followArtistList.push(followItem[0]._id)
  }
}

const onSaveArtists = async () => {
  const artistStore = useArtistsStore()
  const alertStore = useAlertStore()

  try {
    data.isLoading = true

    await artistStore.saveFollowArtist(true, data.followArtistList)

    data.isLoading = false
    await router.push('/')
  } catch (error: unknown) {
    console.error(error)
    data.isLoading = false
    await router.push('/')
  }
}

const getPopularArtist = async () => {
  const artistStore = useArtistsStore()

  try {
    data.isLoading = true
    const response: any = await artistStore.getAllArtists({
      count: 6,
    })

    data.artistList = response.data
    data.isLoading = false
  } catch (error) {
    data.isLoading = false
  }
}

onMounted(() => {
  getPopularArtist()
})
</script>

<template>
  <div class="q-page g-register">
    <form class="g-register__form" @submit.prevent="onSubmit">
      <div class="g-register__form-wrapper">
        <template v-if="step === 0">
          <div class="q-page__header">
            <g-back
              :label="t('pages.register.buttonBackRegister')"
              href="/"
              icon="back"
            />
          </div>

          <h3 class="g-register__title">
            {{ t('pages.register.title') }}
          </h3>

          <div class="g-register__inputs">
            <g-input
              v-model="data.email"
              :dense="dense"
              :icon-class="'mail'"
              :placeholder="t('pages.register.emailPlaceholder')"
              :rules="[
            (val: string, rules: any) =>
              rules.email(val) || t('pages.register.emailValidDescription'),
          ]"
              class="g-register__inputs-label"
              standout
              type="email"
            />

            <g-input
              v-model="data.password"
              :dense="dense"
              :icon-class="'lock'"
              :placeholder="t('pages.register.passwordPlaceholder')"
              :rules="[
            (val: string) => val.length >= 6 || t('pages.register.passwordValidDescription'),
          ]"
              class="g-register__inputs-label"
              password
              standout
            />
          </div>

          <div class="g-register__checkbox">
            <g-checkbox v-model="data.valueTerms">
              {{ t('pages.register.valueTerms.before') }}
              <router-link class="g-link" to="/terms-of-use">
                {{ t('pages.register.valueTerms.link') }}
              </router-link>
            </g-checkbox>
          </div>

          <q-btn
            :disabled="isDisabledButton"
            :label="t('pages.register.buttonSignUp')"
            :loading="data.isLoading"
            class="g-register__btn q-btn-large"
            rounded
            text-color="''"
            unelevated
            @click.prevent="onSubmit"
          />

          <g-social class="g-register__social" />

          <div class="g-register__login">
            {{ t('pages.register.loginDescription') }}
            <router-link class="g-link" to="/login">
              {{ t('pages.register.buttonLogin') }}
            </router-link>
          </div>
        </template>

        <template v-if="step === 1">
          <g-back
            :label="t('pages.register.buttonBackStepOne')"
            icon="back"
            @click-handler="prevStep"
          />

          <div class="g-register__profile-img">
            <g-displayer :size="140" />
          </div>

          <div class="g-register__inputs">
            <g-input
              v-model="data.fullname"
              :dense="dense"
              :placeholder="t('pages.register.fullNamePlaceholder')"
              :rules="[
            (val: string) => val.length >= 6 || t('pages.register.fullNameValidDescription'),
          ]"
              class="g-register__inputs-label"
              standout
              type="text"
            />

            <g-input
              v-model="data.nickname"
              :dense="dense"
              :placeholder="t('pages.register.nickNamePlaceholder')"
              :rules="[
            (val: string) => val.length >= 6 || t('pages.register.nickNameValidDescription'),
          ]"
              class="g-register__inputs-label"
              standout
              type="text"
            />

            <div class="g-input g-register__inputs-label">
              <q-input
                v-model="data.dob"
                :dense="dense"
                :icon-class="'calendar'"
                :placeholder="t('pages.register.dobPlaceholder')"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    t('pages.register.dobValidDescription'),
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
                      mask="DD/MM/YYYY"
                      minimal
                      no-unset
                      @update:model-value="qDateProxy.hide()"
                    ></q-date>
                  </q-popup-proxy>
                </template>
              </q-input>
            </div>

            <q-select
              v-model="data.gender"
              :label="t('pages.register.genderLabel')"
              :options="data.genders"
              class="g-register__select"
              outlined
            />
          </div>

          <div class="g-register__action">
            <q-btn
              :disabled="data.isDisabled"
              :label="t('pages.register.buttonSkip')"
              :loading="data.isLoading"
              class="g-register__btn q-btn--light-primary q-btn-large"
              rounded
              text-color="''"
              unelevated
              @click.prevent="$router.push('/')"
            />

            <q-btn
              :disabled="isDisabledButton"
              :label="t('pages.register.buttonContinue')"
              class="g-register__btn q-btn-large"
              rounded
              text-color="''"
              unelevated
              @click.prevent="onSaveProfile"
            />
          </div>
        </template>

        <template v-if="step === 2">
          <g-back
            :label="t('pages.register.buttonBackStepTwo')"
            icon="back"
            @click-handler="prevStep"
          />

          <div class="g-register__legend">
            <div class="g-register__text-legend">
              {{ t('pages.register.descriptionLegend') }}
            </div>
          </div>

          <div class="g-register__artists">
            <g-follow-artist
              v-for="artist in data.artistList"
              :key="artist._id"
              :artist="artist"
              @add-follow="addFollow"
            />
          </div>

          <div class="g-register__action">
            <q-btn
              :disabled="data.isDisabled"
              :label="t('pages.register.buttonSkip')"
              :loading="data.isLoading"
              class="g-register__btn q-btn--light-primary q-btn-large"
              rounded
              text-color="''"
              unelevated
              @click.prevent="$router.push('/')"
            />

            <q-btn
              :disabled="data.isDisabled"
              :label="t('pages.register.buttonContinue')"
              :loading="data.isLoading"
              class="g-register__btn q-btn-large"
              rounded
              text-color="''"
              unelevated
              @click.prevent="onSaveArtists"
            />
          </div>
        </template>
      </div>
    </form>

    <div class="g-register__illustration" />
  </div>
</template>
