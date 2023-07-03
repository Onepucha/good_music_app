<script lang="ts" setup>
import { computed, CSSProperties, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { Album, Song } from '@/types/artist'
import { useAlertStore, useAuthStore, usePlayerStore } from '@/stores'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    gPlayBtn,
    DynamicIcon,
  },
})

interface Props {
  item: Song | Album
  hover?: boolean
  clickToPlay?: boolean
  type: string
}

const props = withDefaults(defineProps<Props>(), {
  hover: true,
  clickToPlay: false,
  type: '',
})

const emit = defineEmits(['toggleplay', 'set-liked'])

const focus = ref<boolean>(false)
const value = ref<number>(5.5)
const isMobile = ref<boolean | undefined>($q.platform.is.mobile)
const isLoaded = ref<boolean>(false)
const placeholderColor = ref<string>('#bdbdbd')

const randomGradient = computed<CSSProperties>(() => {
  let colors = [
    '#FCE17B',
    '#F8A088',
    '#F75D7F',
    '#AC60F5',
    '#8A79F8',
    '#759FF7',
    '#1758F1',
    '#80C0E8',
    '#A8D2FD',
    '#E23A89',
  ]
  let directions = ['left', 'center', 'right', 'top', 'bottom', 'ellipse']

  let randomColor = colors[Math.floor(Math.random() * colors.length)]
  let randomColorTwo = colors[Math.floor(Math.random() * colors.length)]
  let randomColorThree = colors[Math.floor(Math.random() * colors.length)]
  let randomDirection =
    directions[Math.floor(Math.random() * directions.length)]

  return {
    background: `-webkit-radial-gradient(${randomDirection}, ${randomColor}, ${randomColorTwo}, ${randomColorThree})`,
  }
})

const nameAndInfoCharts = computed<{ name: string; info: string }>(() => {
  let nameAndInfo = props.item?.name?.split('-')

  if (!nameAndInfo) {
    return { name: '', info: '' }
  }

  return {
    name: nameAndInfo[0],
    info: nameAndInfo[1],
  }
})

const songId = computed<string>(() => {
  const song = props?.item?.songs?.at(0)
  return song ? String(song) : ''
})

const handleClick = () => {
  if (!isMobile.value && props.clickToPlay) {
    return false
  } else {
    goTo()
  }
}

const onAudioToggle = () => {
  if (!authStore.user) {
    alertStore.error(t('notPlayingAuth'))
    return false
  }
  emit('toggleplay', props.item)
}

const goTo = () => {
  router.push(`${props.type}/${props.item._id}`)
}

const setLiked = () => {
  emit('set-liked', true, {
    ids: [props.item?._id],
    is_add_to_liked: !props.item?.is_liked,
  })
}
</script>

<template>
  <div
    :class="{
      'g-music-gallery-item__hover': props.hover && !isMobile,
      'g-music-gallery-item-artist': props.type === 'artist',
    }"
    class="g-music-gallery-item"
    @click.prevent="handleClick"
  >
    <div
      class="g-music-gallery-item__picture"
      :class="{
        'g-music-gallery-item__picture-default': !props.item?.cover_src,
      }"
      @mouseleave="focus = false"
      @mouseover="focus = true"
    >
      <div
        v-show="focus && props.clickToPlay"
        class="g-music-gallery-item__shade"
      >
        <g-play-btn
          :playing="playerStore.playing && playerStore.musicId === songId"
          @click.prevent="onAudioToggle"
        />

        <DynamicIcon
          v-if="authStore.user"
          :class="{ active: !!props.item?.is_liked }"
          :size="26"
          name="like"
          @click.prevent="setLiked"
        />

        <div
          v-if="props.type === 'album'"
          class="g-music-gallery-item__shade-label"
          @click.prevent="goTo"
        >
          {{ t('gMusicGalleryItem.label') }}
        </div>
      </div>

      <img
        v-if="props.item?.cover_src"
        :alt="props.item.name"
        :src="props.item?.cover_src"
        class="g-music-gallery-item__picture"
        :style="{
          'background-color': placeholderColor,
        }"
        @load="isLoaded = true"
      />

      <div
        v-else-if="props.type === 'charts'"
        :style="randomGradient"
        class="g-music-gallery-item__gradient"
      >
        <div class="g-music-gallery-item__gradient-title">
          {{ nameAndInfoCharts.name }}
        </div>

        <div class="g-music-gallery-item__gradient-info">
          {{ nameAndInfoCharts.info }}
        </div>
      </div>

      <div v-else class="g-music-gallery-item__gradient">
        <div class="g-music-gallery-item__gradient-title">
          {{ props.item.name }}
        </div>
      </div>

      <q-circular-progress
        v-if="props.type === 'album' && false"
        class="g-music-gallery-item__progress"
        show-value
        :value="value"
        size="40px"
        color="primary"
        :min="0"
        :max="10"
      />
    </div>

    <div class="g-music-gallery-item__description">
      <router-link
        :to="`${props.type}/${props.item._id}`"
        class="g-music-gallery-item__description-title"
      >
        {{ props.item.name }}
      </router-link>
      <div
        v-if="props.item.info"
        class="g-music-gallery-item__description-info"
      >
        {{ props.item.info }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
