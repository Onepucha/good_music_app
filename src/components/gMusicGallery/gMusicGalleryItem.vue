<script lang="ts" setup>
import { computed, CSSProperties, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import gPlayBtn from '@/components/gPlayBtn/gPlayBtn.vue'

const router = useRouter()

defineComponent({
  components: {
    gPlayBtn,
  },
})

interface Item {
  _id: number | string
  cover_src?: string
  name: string
  code: string
  info?: string
  genre?: Array<string>
  song?: Array<string>
  is_verified?: boolean
}

interface Props {
  item: Item
  hover?: boolean
  clickToPlay?: boolean
  type: string
}

const props = withDefaults(defineProps<Props>(), {
  hover: true,
  clickToPlay: false,
  type: '',
})

const focus = ref<boolean>(false)

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
  let nameAndInfo = props.item.name.split('-')

  return {
    name: nameAndInfo[0],
    info: nameAndInfo[1],
  }
})

const clickHandler = () => {
  props.clickToPlay ? play() : goTo()
}

const play = () => {
  console.log('play')
}

const goTo = () => {
  router.push(`${props.type}/${props.item._id}`)
}
</script>

<template>
  <div
    :class="{
      'g-music-gallery-item__hover': hover,
      'g-music-gallery-item-artist': props.type === 'artist',
    }"
    class="g-music-gallery-item"
    @click.prevent="clickHandler"
  >
    <div
      class="g-music-gallery-item__picture"
      :class="{
        'g-music-gallery-item__picture-default': !props.item?.cover_src,
      }"
      @mouseleave="focus = false"
      @mouseover="focus = true"
    >
      <div v-show="focus" class="g-music-gallery-item__shade">
        <g-play-btn v-if="clickToPlay" />
      </div>

      <img
        v-if="props.item?.cover_src"
        :alt="props.item.name"
        :src="props.item?.cover_src"
        class="g-music-gallery-item__picture"
        loading="lazy"
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
    </div>

    <div class="g-music-gallery-item__description">
      <router-link
        :to="props.item.code"
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
