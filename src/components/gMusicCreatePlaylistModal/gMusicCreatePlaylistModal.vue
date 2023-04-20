<script setup lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gInput from '@/components/gInput/gInput.vue'
import { useTranslation } from '@/composables/lang'
import { useAuthStore } from '@/stores'
import { minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import PlaylistsApi from '@/services/playlists'

defineComponent({
  components: {
    DynamicIcon,
    gInput,
  },
})

const { t } = useTranslation()
const authStore = useAuthStore()

interface Data {
  isLoading: boolean
  name: string
  description: string
  playlistOptions: {
    icon: string
    label: string
  }
}

const data: Data = reactive({
  name: '',
  description: '',
  playlistOptions: {
    icon: 'public',
    label: 'Public',
  },
  isLoading: false,
})

const emit = defineEmits(['close-modal'])

const dialog = ref<boolean>(false)
const qDialogPopup = ref<any>(null)
const position = ref<any>('bottom')
const isLoading = ref<boolean>(false)
const dense = ref<boolean>(false)
const playlistsOptions = ref([
  {
    icon: 'public',
    label: 'Public',
  },
  {
    icon: 'private',
    label: 'Private',
  },
])

const rules = computed(() => {
  return {
    name: { required, minLength: minLength(6) },
    description: { required, minLength: minLength(6) },
    playlistOptions: { required },
  }
})

const v$ = useVuelidate(rules, data)

const hasPublic = computed<boolean>(() => {
  return data.playlistOptions.label === 'Public'
})

const isDisabledButton = computed<boolean>(() => {
  return v$.value.$invalid
})

const createPlaylist = async () => {
  try {
    let code = data.name.replaceAll(' ', '_').toLowerCase()
    let payload = {
      name: data.name,
      code: code,
      description: data.description,
      hasPublic: hasPublic.value,
    }

    await PlaylistsApi.setPlaylist(payload)
    emit('close-modal', false)
  } catch (error: unknown) {
    emit('close-modal', false)
    console.error(error)
  }
}
</script>

<template>
  <q-dialog
    ref="qDialogPopup"
    v-model="dialog"
    :position="position"
    class="g-music-create-playlist-modal"
  >
    <q-card>
      <q-card-section class="g-music-create-playlist-modal__body text-center">
        <form>
          <h4>{{ t('pages.playlists.popup.title') }}</h4>

          <g-input
            v-model="data.name"
            :dense="dense"
            :placeholder="t('pages.playlists.popup.namePlaceholder')"
            class="g-music-create-playlist-modal__inputs-label"
            standout
            :rules="[
            (val: string) => val.length >= 6 || t('pages.playlists.popup.nameValidDescription')]"
          />

          <g-input
            v-model="data.description"
            :dense="dense"
            :placeholder="t('pages.playlists.popup.descriptionPlaceholder')"
            class="g-music-create-playlist-modal__inputs-label"
            standout
            :rules="[
            (val: string) => val.length >= 6 || t('pages.playlists.popup.descriptionValidDescription')]"
          />

          <q-select
            v-model="data.playlistOptions"
            :options="playlistsOptions"
            class="g-music-create-playlist-modal__select"
            outlined
          >
            <template #prepend>
              <DynamicIcon :name="data.playlistOptions.icon" :size="20" />
            </template>

            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <DynamicIcon :name="scope.opt.icon" :size="20" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="g-music-create-playlist-modal__action">
            <q-btn
              v-close-popup
              :label="t('pages.playlists.popup.buttonCancel')"
              class="q-btn--light-primary q-btn-large full-width"
              rounded
              text-color="''"
              unelevated
            />

            <q-btn
              :label="t('pages.playlists.popup.buttonConfirm')"
              :disabled="isDisabledButton"
              :loading="isLoading"
              class="q-btn-large full-width"
              rounded
              text-color="''"
              unelevated
              @click.prevent="createPlaylist"
            />
          </div>
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
