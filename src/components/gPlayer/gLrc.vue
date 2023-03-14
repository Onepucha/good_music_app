<script setup lang="ts">
import { parseLrc } from '@/utils/utils'
import { computed, CSSProperties, reactive, watch } from 'vue'

const props = defineProps<{
  currentMusic: any
  playStat: object | any
}>()

interface Data {
  displayLrc: string
  currentLineIndex: number
}

const data: Data = reactive({
  displayLrc: '',
  currentLineIndex: 0,
})

const lrcLines = computed<any>(() => {
  return parseLrc(data.displayLrc)
})

const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translateY(${-data.currentLineIndex * 16}px)`,
    webkitTransform: `translateY(${-data.currentLineIndex * 16}px)`,
  }
})

watch(
  () => props.currentMusic,
  (music: any) => {
    data.currentLineIndex = 0
    if (music.lrc) {
      applyLrc(music.lrc)
    } else {
      data.displayLrc = ''
    }
  },
  { immediate: true }
)

watch(
  () => props.playStat.playedTime,
  (playedTime: any) => {
    for (let i = 0; i < lrcLines.value.length; i++) {
      const line = lrcLines.value[i]
      const nextLine = lrcLines.value[i + 1]
      if (playedTime >= line[0] && (!nextLine || playedTime < nextLine[0])) {
        data.currentLineIndex = i
      }
    }
  }
)

const applyLrc = (lrc: string) => {
  if (/^https?:\/\//.test(lrc)) {
    fetchLrc(lrc)
  } else {
    data.displayLrc = lrc
  }
}

const fetchLrc = (src: string) => {
  fetch(src)
    .then((response) => response.text())
    .then((lrc) => {
      data.displayLrc = lrc
    })
}
</script>

<template>
  <div class="g-player-lrc">
    <div class="g-player-lrc-contents" :style="transformStyle">
      <p
        v-for="(line, index) of lrcLines"
        :key="index"
        :class="{ 'g-player-lrc-current': index === data.currentLineIndex }"
      >
        {{ line[1] }}
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.g-player-lrc {
  position: relative;
  height: $lrc-height;
  text-align: center;
  overflow: hidden;
  margin-bottom: 7px;

  &:before {
    position: absolute;
    top: 0;
    z-index: 1;
    display: block;
    overflow: hidden;
    width: 100%;
    height: 10%;
    content: ' ';
    background: -moz-linear-gradient(
      top,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    background: -webkit-linear-gradient(
      top,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#00ffffff', GradientType=0);
  }

  &:after {
    position: absolute;
    bottom: 0;
    z-index: 1;
    display: block;
    overflow: hidden;
    width: 100%;
    height: 33%;
    content: ' ';
    background: -moz-linear-gradient(
      top,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    background: -webkit-linear-gradient(
      top,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffffff', endColorstr='#ccffffff', GradientType=0);
  }

  p {
    font-size: 12px;
    color: #666;
    line-height: 16px;
    height: 16px;
    padding: 0;
    margin: 0;
    transition: $animate-delay;
    opacity: 0.4;
    overflow: hidden;

    &.g-player-lrc-current {
      opacity: 1;
      overflow: visible;
      height: initial;
    }
  }

  .g-player-lrc-contents {
    width: 100%;
    transition: $animate-delay;
    user-select: text;
    cursor: default;
  }
}
</style>
