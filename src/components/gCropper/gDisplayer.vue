<script setup lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import gCropper from './gCropper.vue'
import { useAlertStore, useAuthStore } from '@/stores'
import defaultAvatar from '@/assets/images/avatar.png'
import Global from '@/services/global'
import { User } from '@/types/users'

defineComponent({
  components: {
    gCropper,
  },
})

const authStore = useAuthStore()
const alertStore = useAlertStore()

const authUser = computed<User | undefined>(() => authStore.user)

interface Props {
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 80,
})

interface Data {
  imageSrc: string
  fileName: File | FileList | null | undefined
}

const data: Data = reactive({
  imageSrc: authUser.value?.avatar || defaultAvatar,
  fileName: null,
})

const cropper = ref<boolean>(false)
const inputFile = ref<File | FileList>()

const handleFile = async (file: any) => {
  try {
    const formData = new FormData()
    const uploadFile = file.target.files[0]
    data.imageSrc = URL.createObjectURL(uploadFile)

    formData.append('file', uploadFile)

    await Global.uploadAvatar(formData)
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
      data.imageSrc = authStore?.user?.avatar || ''
    }
  }
  // cropper.value = true
}

const finishCropper = (croppedImage: string) => {
  data.imageSrc = croppedImage
}
</script>

<template>
  <q-file
    ref="inputFile"
    v-model="data.fileName"
    outlined
    clearable
    class="hidden"
    label="Browse files..."
    max-file-size="1024"
    @input="handleFile"
  />
  <div id="display-area">
    <q-avatar :size="`${props.size}px`" class="g-profile__account-avatar">
      <img ref="image" :src="data.imageSrc" :alt="authUser?.fullname" />

      <i
        class="g-profile__account-avatar-edit"
        @click="inputFile.nativeEl.click()"
      ></i>
    </q-avatar>
  </div>
  <q-dialog
    ref="popup"
    v-model="cropper"
    anchor="center middle"
    self="center left"
    transition-show="scale"
    transition-hide="scale"
    target="#display-area"
  >
    <q-card>
      <q-card-section class="g-popup-forgot-password__body text-center">
        <g-cropper :image-src="data.imageSrc" @destroy="finishCropper" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
