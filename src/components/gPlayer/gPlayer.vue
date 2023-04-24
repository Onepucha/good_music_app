<script lang="ts">
const REPEAT = {
  NONE: 'none',
  MUSIC: 'music',
  LIST: 'list',
  NO_REPEAT: 'no-repeat',
  REPEAT_ONE: 'repeat-one',
  REPEAT_ALL: 'repeat-all',
}

const picThemeCache = {} as any
</script>

<script setup lang="ts">
import gTrack from './gTrack.vue'
import gList from './gList.vue'
import gController from './gController.vue'
import gControllerMini from './gControllerMini.vue'
import gControllerBottom from './gControllerBottom.vue'
import gCast from './gCast.vue'
import gLrc from './gLrc.vue'
import gSongPlay from './gSongPlay.vue'

import {
  computed,
  defineComponent,
  reactive,
  ref,
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  CSSProperties,
} from 'vue'
import ColorThief from 'color-thief-ts'
import Hls from 'hls.js'
import { Song } from '@/types/artist'
import { usePlayerStore } from '@/stores/'
import { useQuasar } from 'quasar'
import Songs from '@/services/songs'
import GControllerBottom from '@/components/gPlayer/gControllerBottom.vue'

const $q = useQuasar()
// mutex playing instance
let activeMutex: { pause: () => void } | null | undefined = null
const playerStore = usePlayerStore()

defineComponent({
  components: {
    gTrack,
    gList,
    gController,
    gControllerMini,
    gControllerBottom,
    gCast,
    gLrc,
    gSongPlay,
  },
})

interface Props {
  music: Song
  list?: Array<Song> | undefined
  mini?: boolean
  showLrc?: boolean
  mutex?: boolean
  theme?: string
  listMaxHeight?: string
  listFolded?: boolean
  float?: boolean
  autoplay?: boolean
  controls?: boolean
  muted?: any
  preload?: any
  volume?: any
  shuffle?: any
  repeat?: any
  fixed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  music: undefined,
  list: () => [],
  mini: false,
  showLrc: false,
  mutex: true,
  theme: '',
  listMaxHeight: '',
  listFolded: false,
  float: false,
  autoplay: false,
  controls: false,
  muted: false,
  preload: '',
  volume: 0.8,
  shuffle: false,
  repeat: REPEAT.NO_REPEAT,
  fixed: false,
})

interface playStat {
  duration: number
  loadedTime: number
  playedTime: number
}

interface Data {
  internalMusic: Song
  internalList: Array<Song>
  isSeeking: boolean
  wasPlayingBeforeSeeking: boolean
  isMobile: any
  playStat: playStat
  showList: any
  audioPlayPromise: any
  floatOriginX: number
  floatOriginY: number
  floatOffsetLeft: number
  floatOffsetTop: number
  selfAdaptingTheme: any
  internalMuted: boolean
  internalVolume: number
  isLoading: boolean
  internalShuffle: boolean
  internalRepeat: string
  shuffledList: any
  rejectPlayPromise: any
  showSongPlay: boolean
}

const data: Data = reactive({
  internalMusic: props.music,
  internalList: props.list,
  isSeeking: false,
  wasPlayingBeforeSeeking: false,
  isMobile: /mobile/i.test(window.navigator.userAgent),
  playStat: {
    duration: 0,
    loadedTime: 0,
    playedTime: 0,
  },
  showList: props.listFolded,
  showSongPlay: false,
  audioPlayPromise: Promise.resolve(),
  floatOriginX: 0,
  floatOriginY: 0,
  floatOffsetLeft: 0,
  floatOffsetTop: 0,
  selfAdaptingTheme: null,
  internalMuted: props.muted,
  internalVolume: props.volume,
  isLoading: false,
  internalShuffle: props.shuffle,
  internalRepeat: props.repeat,
  shuffledList: [],
  rejectPlayPromise: null,
})

let audio = ref<any>(document.createElement('audio'))
const showModalSongPlay = ref(false)
const maximizedToggle = ref(true)

const emit = defineEmits([
  'update:music',
  'update:muted',
  'update:volume',
  'update:shuffle',
  'update:repeat',
  'abort',
  'canplay',
  'canplaythrough',
  'durationchange',
  'emptied',
  'encrypted',
  'ended',
  'error',
  'interruptbegin',
  'interruptend',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'mozaudioavailable',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'timeupdate',
  'volumechange',
  'waiting',
])

const currentMusic = computed<any>({
  get() {
    return data.internalMusic
  },
  set(val) {
    emit('update:music', val)
    data.internalMusic = val
  },
})

const currentTheme = computed<string>(() => {
  return data.selfAdaptingTheme || currentMusic.value.theme || props.theme
})

const isFloatMode = computed<boolean>(() => {
  return props.float && !data.isMobile
})

const shouldAutoplay = computed<boolean>(() => {
  if (data.isMobile) return false
  return props.autoplay
})

const musicList = computed<any>({
  get() {
    return data.internalList
  },
  set(val) {
    data.internalList = val
  },
})

const shouldShowNativeControls = computed<boolean>(() => {
  return (
    import.meta.env.VITE_STAGE !== 'production' && props.controls && !props.mini
  )
})

const currentPicStyleObj = computed<CSSProperties>(() => {
  if (currentMusic.value && currentMusic.value.pic) {
    return {
      backgroundImage: `url(${currentMusic.value.pic})`,
    }
  }
  return {}
})

const loadProgress = computed<number>(() => {
  if (data.playStat.duration === 0) return 0
  return data.playStat.loadedTime / data.playStat.duration
})

const playProgress = computed<number>(() => {
  if (data.playStat.duration === 0) return 0
  return data.playStat.playedTime / data.playStat.duration
})

const playIndex = computed<any>({
  get() {
    return data.shuffledList.indexOf(currentMusic.value)
  },
  set(val) {
    currentMusic.value = data.shuffledList[val % data.shuffledList.length]
  },
})

const shouldRepeat = computed<boolean>(() => {
  return repeatMode.value !== REPEAT.NO_REPEAT
})

const isAudioMuted = computed<boolean>({
  get() {
    return data.internalMuted
  },
  set(val) {
    emit('update:muted', val)
    data.internalMuted = val
  },
})

const audioVolume = computed<number>({
  get() {
    return data.internalVolume
  },
  set(val) {
    emit('update:volume', val)
    localStorage.setItem('volume', val.toString())
    data.internalVolume = val
  },
})

const shouldShuffle = computed<boolean>({
  get() {
    return data.internalShuffle
  },
  set(val) {
    emit('update:shuffle', val)
    data.internalShuffle = val
  },
})

const repeatMode = computed<string>({
  get() {
    switch (data.internalRepeat) {
      case REPEAT.NONE:
      case REPEAT.NO_REPEAT:
        return REPEAT.NO_REPEAT
      case REPEAT.MUSIC:
      case REPEAT.REPEAT_ONE:
        return REPEAT.REPEAT_ONE
      default:
        return REPEAT.REPEAT_ALL
    }
  },
  set(val) {
    emit('update:repeat', val)
    data.internalRepeat = val
  },
})

const previousItem = computed(() => {
  const currentIndex = data.internalList.findIndex(
    (item) => item._id === currentMusic.value._id
  )
  if (currentIndex > 0) {
    return data.internalList[currentIndex - 1]
  } else {
    return data.internalList[data.internalList.length - 1]
  }
})

const nextItem = computed(() => {
  const currentIndex = data.internalList.findIndex(
    (item) => item._id === currentMusic.value._id
  )
  if (currentIndex < data.internalList.length - 1) {
    return data.internalList[currentIndex + 1]
  } else {
    return data.internalList[0]
  }
})

const onDragBegin = () => {
  data.floatOriginX = data.floatOffsetLeft
  data.floatOriginY = data.floatOffsetTop
}

interface Offsets {
  offsetLeft: number
  offsetTop: number
}

const onDragAround = ({ offsetLeft, offsetTop }: Offsets) => {
  data.floatOffsetLeft = data.floatOriginX + offsetLeft
  data.floatOffsetTop = data.floatOriginY + offsetTop
}

const setNextMode = () => {
  if (repeatMode.value === REPEAT.REPEAT_ALL) {
    repeatMode.value = REPEAT.REPEAT_ONE
  } else if (repeatMode.value === REPEAT.REPEAT_ONE) {
    repeatMode.value = REPEAT.NO_REPEAT
  } else {
    repeatMode.value = REPEAT.REPEAT_ALL
  }
}

const play = () => {
  if (props.mutex) {
    if (activeMutex) {
      activeMutex.pause()
    }
  }
  // handle .play() Promise
  const audioPlayPromise = audio.value.play()
  if (audioPlayPromise) {
    return (data.audioPlayPromise = new Promise((resolve, reject) => {
      // rejectPlayPromise is to force reject audioPlayPromise if it's still pending when pause() is called
      data.rejectPlayPromise = reject
      audioPlayPromise
        .then((res: any) => {
          data.rejectPlayPromise = null
          resolve(res)
        })
        .catch((error: unknown) => console.error(error))
    }))
  }
}

const pause = () => {
  data.audioPlayPromise
    .then(() => {
      audio.value.pause()
    })
    // Avoid force rejection throws Uncaught
    .catch(() => {
      audio.value.pause()
    })

  // audioPlayPromise is still pending
  if (data.rejectPlayPromise) {
    // force reject playPromise
    data.rejectPlayPromise()
    data.rejectPlayPromise = null
  }
}

const toggle = () => {
  if (!audio.value?.paused) {
    pause()
  } else {
    play()
  }
}

const thenPlay = () => {
  nextTick(() => {
    play()
  })
}

const onProgressDragBegin = (val: number) => {
  data.wasPlayingBeforeSeeking = playerStore.playing
  pause()
  data.isSeeking = true

  // handle load failures
  if (!isNaN(audio.value.duration)) {
    audio.value.currentTime = audio.value.duration * val
  }
}

const onProgressDragging = (val: number) => {
  if (isNaN(audio.value.duration)) {
    data.playStat.playedTime = 0
  } else {
    audio.value.currentTime = audio.value.duration * val
  }
}

const onProgressDragEnd = () => {
  data.isSeeking = false

  if (data.wasPlayingBeforeSeeking) {
    thenPlay()
  }
}

const setAudioMuted = (val: boolean) => {
  audio.value.muted = val
}

const setAudioVolume = (val: number) => {
  audio.value.volume = val
  if (val > 0) {
    setAudioMuted(false)
  }
}

const toggleMute = () => {
  setAudioMuted(!audio.value.muted)
}

const getShuffledList = () => {
  if (!data.internalList.length) {
    return [data.internalMusic]
  }
  let unshuffled = [...data.internalList]
  if (!data.internalShuffle || unshuffled.length <= 1) {
    return unshuffled
  }

  let indexOfCurrentMusic = unshuffled.indexOf(data.internalMusic)
  if (unshuffled.length === 2 && indexOfCurrentMusic !== -1) {
    if (indexOfCurrentMusic === 0) {
      return unshuffled
    } else {
      return [data.internalMusic, unshuffled[0]]
    }
  }
  // shuffle list
  // @see https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  for (let i = unshuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = unshuffled[i]
    unshuffled[i] = unshuffled[j]
    unshuffled[j] = tmp
  }

  // take currentMusic to first
  if (indexOfCurrentMusic !== -1) {
    indexOfCurrentMusic = unshuffled.indexOf(data.internalMusic)
    if (indexOfCurrentMusic !== 0) {
      ;[unshuffled[0], unshuffled[indexOfCurrentMusic]] = [
        unshuffled[indexOfCurrentMusic],
        unshuffled[0],
      ]
    }
  }

  return unshuffled
}

const onPrevSong = () => {
  let currentMusic: Song

  currentMusic = {
    _id: previousItem.value._id,
    title: previousItem.value.name,
    artist: previousItem.value?.artists?.at(0)?.name,
    src: previousItem.value.url,
    is_liked: previousItem.value.is_liked,
  } as Song

  data.internalMusic = currentMusic
  playerStore.setMusic(currentMusic, 0)
  thenPlay()
}

const onNextSong = () => {
  let currentMusic: Song

  currentMusic = {
    _id: nextItem.value?._id,
    title: nextItem.value?.name,
    artist: nextItem.value?.artists?.at(0)?.name,
    src: nextItem.value?.url,
    is_liked: nextItem.value.is_liked,
  } as Song

  data.internalMusic = currentMusic
  playerStore.setMusic(currentMusic, 0)
  thenPlay()
}

const onRewindPrev = () => {
  audio.value.currentTime -= 10
}

const onRewindNext = () => {
  audio.value.currentTime += 10
}

const onSelectSong = (song: any) => {
  if (currentMusic.value === song) {
    toggle()
  } else {
    currentMusic.value = song
    thenPlay()
  }
}

const onAudioPlay = () => {
  playerStore.setPlaying(true)
}

const onAudioPause = () => {
  playerStore.setPlaying(false)
}

const onAudioWaiting = () => {
  data.isLoading = true
}

const onAudioCanplay = () => {
  data.isLoading = false
}

const onAudioDurationChange = () => {
  if (audio.value.duration !== 1) {
    data.playStat.duration = audio.value.duration
  }
}

const onAudioProgress = () => {
  if (audio.value?.buffered.length) {
    data.playStat.loadedTime = audio.value.buffered.end(
      audio.value.buffered.length - 1
    )
  } else {
    data.playStat.loadedTime = 0
  }
}

const onAudioTimeUpdate = () => {
  data.playStat.playedTime = audio.value.currentTime
}

const onAudioSeeking = () => {
  data.playStat.playedTime = audio.value.currentTime
}

const onAudioSeeked = () => {
  data.playStat.playedTime = audio.value.currentTime
}

const onAudioVolumeChange = () => {
  audioVolume.value = audio.value.volume
  isAudioMuted.value = audio.value.muted
}

const onAudioEnded = () => {
  // determine next song according to shuffle and repeat
  if (repeatMode.value === REPEAT.REPEAT_ALL) {
    if (
      shouldShuffle.value &&
      playIndex.value === data.shuffledList.length - 1
    ) {
      data.shuffledList = getShuffledList()
    }
    playIndex.value++
    thenPlay()
  } else if (repeatMode.value === REPEAT.REPEAT_ONE) {
    thenPlay()
  } else {
    playIndex.value++
    if (playIndex.value !== 0) {
      thenPlay()
    } else if (data.shuffledList.length === 1) {
      audio.value.currentTime = 0
    }
  }
}

const initAudio = () => {
  audio.value.controls = shouldShowNativeControls.value
  audio.value.muted = props.muted
  audio.value.preload = props.preload
  audio.value.volume = props.volume

  const mediaEvents = [
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'encrypted',
    'ended',
    'error',
    'interruptbegin',
    'interruptend',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'mozaudioavailable',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
  ]
  mediaEvents.forEach((event: any) => {
    audio.value.addEventListener(event, (e: string) => emit(event, e))
  })

  audio.value.addEventListener('play', onAudioPlay)
  audio.value.addEventListener('pause', onAudioPause)
  audio.value.addEventListener('abort', onAudioPause)
  audio.value.addEventListener('waiting', onAudioWaiting)
  audio.value.addEventListener('canplay', onAudioCanplay)
  audio.value.addEventListener('progress', onAudioProgress)
  audio.value.addEventListener('durationchange', onAudioDurationChange)
  audio.value.addEventListener('seeking', onAudioSeeking)
  audio.value.addEventListener('seeked', onAudioSeeked)
  audio.value.addEventListener('timeupdate', onAudioTimeUpdate)
  audio.value.addEventListener('volumechange', onAudioVolumeChange)
  audio.value.addEventListener('ended', onAudioEnded)

  if (currentMusic.value) {
    audio.value.src = currentMusic.value.src
  }
}

type ColorArray = [number, number, number]

type ColorType = 'array' | 'hex'

interface PaletteOptions<T extends ColorType = ColorType> {
  quality?: number
  colorType?: T
}

const setSelfAdaptingTheme = () => {
  // auto theme according to current music cover image
  if ((currentMusic.value?.theme || props.theme) === 'pic') {
    const pic = currentMusic.value.pic

    // use cache
    if (picThemeCache[pic]) {
      data.selfAdaptingTheme = picThemeCache[pic]
    } else {
      try {
        const colorThief = new ColorThief()

        colorThief.getColorAsync(pic).then((result) => {
          picThemeCache[pic] = result
          data.selfAdaptingTheme = result
        })
      } catch (error: unknown) {
        console.error(error)
      }
    }
  } else {
    data.selfAdaptingTheme = null
  }
}

const showSongPlay = () => {
  showModalSongPlay.value = true
}

const setLiked = async (
  isSingle: boolean,
  object: {
    ids: string[]
    is_add_to_liked: boolean
  }
) => {
  try {
    await Songs.setLiked(object.ids, object.is_add_to_liked)

    const index = data.internalList?.findIndex(
      (song) => song._id === object.ids.at(0)
    )

    if (isSingle) {
      if (currentMusic.value) {
        currentMusic.value.is_liked = object.is_add_to_liked
      }

      if (
        currentMusic.value &&
        data.internalList &&
        currentMusic.value._id === data.internalList[index]._id &&
        index !== undefined
      ) {
        data.internalList[index].is_liked = object.is_add_to_liked
      }
    } else {
      if (
        currentMusic.value &&
        currentMusic.value._id === data.internalList[index]._id &&
        index !== undefined
      ) {
        currentMusic.value.is_liked = object.is_add_to_liked
      }

      if (data.internalList && index !== undefined) {
        data.internalList[index].is_liked = object.is_add_to_liked
      }
    }
  } catch (error: unknown) {
    console.error(error)
  }
}

watch(
  () => props.music,
  (music: any) => {
    data.internalMusic = music
  }
)

watch(currentMusic, (music: any) => {
  setSelfAdaptingTheme()

  const src = music.src
  let hls = null
  // HLS support
  if (/\.m3u8(?=(#|\?|$))/.test(src)) {
    if (
      audio.value.canPlayType('application/x-mpegURL') ||
      audio.value.canPlayType('application/vnd.apple.mpegURL')
    ) {
      audio.value.src = src
    } else {
      try {
        if (Hls.isSupported()) {
          if (!hls) {
            hls = new Hls()
          }
          hls.loadSource(src)
          hls.attachMedia(audio.value)
        } else {
          audio.value.src = src
        }
      } catch (error: unknown) {
        console.error(error)
        audio.value.src = src
      }
    }
  } else {
    audio.value.src = src
  }
})

watch(shouldShowNativeControls, (val: any) => {
  audio.value.controls = val
})

watch(isAudioMuted, (val: any) => {
  audio.value.muted = val
})

watch(
  () => props.preload,
  (val: any) => {
    audio.value.preload = val
  }
)

watch(audioVolume, (val: any) => {
  audio.value.volume = val
})

watch(
  () => props.muted,
  (val: any) => {
    data.internalMuted = val
  }
)

watch(
  () => props.volume,
  (val: any) => {
    data.internalVolume = val
  }
)

watch(
  () => props.shuffle,
  (val: any) => {
    data.internalShuffle = val
  }
)

watch(
  () => props.repeat,
  (val: any) => {
    data.internalRepeat = val
  }
)

onMounted(() => {
  if (localStorage.getItem('volume')) {
    try {
      data.internalVolume = JSON.parse(localStorage.getItem('volume') as string)
    } catch (error) {
      localStorage.removeItem('favorite')
    }
  }

  initAudio()
  setSelfAdaptingTheme()
  if (props.autoplay) play()
})

onUnmounted(() => {
  if (activeMutex === this) {
    activeMutex = null
  }
})

data.shuffledList = getShuffledList()

defineExpose({ data, play, pause, toggle })
</script>

<template>
  <div
    class="g-player"
    :class="{
      'g-player-mini': mini,
      'g-player-withlist': !mini && musicList.length > 0,
      'g-player-withlrc': !mini && (!!$slots.display || showLrc),
      'g-player-float': isFloatMode,
      'g-player-loading': playerStore.playing && data.isLoading,
      'g-player-fixed': fixed,
    }"
  >
    <template v-if="!$q.platform.is.mobile">
      <div class="g-player-body">
        <g-track
          :current-music="currentMusic"
          :enable-drag="isFloatMode"
          :theme="currentTheme"
          @dragbegin="onDragBegin"
          @dragging="onDragAround"
          @set-liked="setLiked"
        />

        <div v-show="!mini" class="g-player-info">
          <slot
            name="display"
            :current-music="currentMusic"
            :play-stat="data.playStat"
          >
            <g-lrc
              v-if="showLrc"
              :current-music="currentMusic"
              :play-stat="data.playStat"
            />
          </slot>
          <g-controller
            :stat="data.playStat"
            :theme="currentTheme"
            :has-controls="data.internalList.length > 0"
            :playing="playerStore.playing"
            :music-list="musicList"
            @toggleplay="toggle"
            @dragbegin="onProgressDragBegin"
            @dragend="onProgressDragEnd"
            @dragging="onProgressDragging"
            @track-prev="onPrevSong"
            @track-rewind-prev="onRewindPrev"
            @track-next="onNextSong"
            @track-rewind-next="onRewindNext"
          />
        </div>
        <g-cast
          v-if="$q.platform.is.desktop"
          :volume="audioVolume"
          :theme="currentTheme"
          :muted="isAudioMuted"
          :repeat="repeatMode"
          :has-menu="data.internalList.length > 0"
          @togglemute="toggleMute"
          @setvolume="setAudioVolume"
          @toggleshuffle="shouldShuffle = !shouldShuffle"
          @nextmode="setNextMode"
          @togglelist="data.showList = !data.showList"
        />
      </div>
      <audio ref="audio"></audio>
      <g-list
        :show="data.showList"
        :current-music="currentMusic"
        :music-list="musicList"
        :play-index="playIndex"
        :listmaxheight="listMaxHeight"
        :theme="currentTheme"
        :fixed="fixed"
        @selectsong="onSelectSong"
      />
    </template>

    <template v-else>
      <div class="g-player-body">
        <g-track
          :current-music="currentMusic"
          :enable-drag="isFloatMode"
          :theme="currentTheme"
          @dragbegin="onDragBegin"
          @dragging="onDragAround"
          @set-liked="setLiked"
          @click.prevent="showSongPlay"
        />

        <g-controller-mini
          :has-controls="data.internalList.length > 0"
          :playing="playerStore.playing"
          @toggleplay="toggle"
          @track-next="onNextSong"
        />
      </div>
    </template>
    <q-dialog
      v-model="showModalSongPlay"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <g-song-play
        :current-music="currentMusic"
        @hide-song-play="showModalSongPlay = false"
      >
        <g-controller
          :stat="data.playStat"
          :theme="currentTheme"
          :has-controls="data.internalList.length > 0"
          :playing="playerStore.playing"
          :music-list="musicList"
          @toggleplay="toggle"
          @dragbegin="onProgressDragBegin"
          @dragend="onProgressDragEnd"
          @dragging="onProgressDragging"
          @track-prev="onPrevSong"
          @track-rewind-prev="onRewindPrev"
          @track-next="onNextSong"
          @track-rewind-next="onRewindNext"
        />

        <g-controller-bottom />
      </g-song-play>
    </q-dialog>
  </div>
</template>

<style lang="scss">
.g-player {
  position: relative;
  transition: $animate-duration;

  &.g-player-fixed {
    position: fixed;
    z-index: 2001;
    right: 0;
    bottom: 0;
    left: 0;

    &.g-player__home {
      @media #{$mobile} {
        bottom: 88px;
      }
    }
  }

  .g-player-lrc-content {
    display: none;
  }

  .g-player-body {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 16px 10px;
    background-color: $white;
    border-top: 1px solid $gray200;
    overflow: hidden;
    user-select: none;

    @media #{$mobile} {
      gap: 16px;
      padding: 23px 23px 35px;
      border: 1px solid $greyscale100;
      border-radius: 32px 32px 0 0;
    }

    .g-player-info {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 958px;
    }
  }

  audio[controls] {
    display: block;
    width: 100%;
  }
}

body.body--dark {
  .g-player {
    .g-player-body {
      background-color: $dark-1;
      border-top: 1px solid $white;
    }
  }
}
</style>
