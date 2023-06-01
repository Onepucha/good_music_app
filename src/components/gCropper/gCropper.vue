<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { CropperInstance } from '@/types/options'

const props = defineProps<{
  imageSrc: string
}>()

interface Data {
  cropper: CropperInstance | undefined
  destination: string | undefined
  preview: boolean
}

const data: Data = reactive({
  cropper: undefined,
  destination: '',
  preview: false,
})

const image = ref<any>(null)
const emit = defineEmits(['destroy'])

const startCropper = () => {
  data.cropper = new Cropper(image.value, {
    viewMode: 1,
    aspectRatio: 1 / 1,
    crop: () => {
      data.destination = data.cropper
        ?.getCroppedCanvas()
        .toDataURL('image/jpeg')
      data.preview = true
    },
  })
}

const destroyCropper = () => {
  data.cropper?.destroy()
}

const resetCropper = () => {
  data.cropper?.reset()
}

const rotateLeft = () => {
  data.cropper?.rotate(-90)
}

const rotateRight = () => {
  data.cropper?.rotate(90)
}

const finish = () => {
  emit('destroy', data.destination)
}

onMounted(() => {
  startCropper()
})
</script>

<template>
  <div class="wrapper column items-center no-scroll">
    <!-- <div class="row space-between no-wrap"> -->
    <div class="column items-center no-wrap">
      <div class="row justify-between no-wrap q-mb-md">
        <q-btn round icon="rotate_left" color="primary" @click="rotateLeft">
          <q-tooltip content-class="bg-secondary">Rotate left</q-tooltip>
        </q-btn>
        <q-btn round icon="rotate_right" color="primary" @click="rotateRight">
          <q-tooltip content-class="bg-secondary">Rotate right</q-tooltip>
        </q-btn>
        <q-btn
          round
          icon="settings_backup_restore"
          color="primary"
          @click="resetCropper"
        >
          <q-tooltip content-class="bg-secondary">Reset</q-tooltip>
        </q-btn>
        <q-btn v-close-popup round icon="close" color="primary">
          <q-tooltip content-class="bg-secondary">Cancel</q-tooltip>
        </q-btn>
        <q-btn v-close-popup round icon="done" color="primary" @click="finish">
          <q-tooltip content-class="bg-secondary">Crop and finish</q-tooltip>
        </q-btn>
      </div>
      <div class="container">
        <img ref="image" :src="props.imageSrc" alt="cropper" />
      </div>
      <!--      <p class="q-mt-md text-weight-bold">Preview:</p>-->
      <!--      <div v-if="data.preview" class="preview-container column items-center">-->
      <!--        <img class="preview" :src="data.destination" />-->
      <!--      </div>-->
      <!--      <div v-else class="preview column items-center">-->
      <!--        Loading cropper...-->
      <!--        <q-spinner size="3em" color="primary" />-->
      <!--      </div>-->
    </div>
  </div>
</template>

<style scoped></style>
