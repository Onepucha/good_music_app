<script setup lang="ts">
import DynamicIcon from '@/components/DynamicIcon.vue'
import { computed, defineComponent, ref } from 'vue'
import { useTranslation } from '@/composables/lang'
import { usePlayerStore } from '@/stores'
import { Song } from '@/types/artist'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const { t } = useTranslation()
const playerStore = usePlayerStore()

const props = defineProps<{
  song?: Song
  label: string
  recently: string
  action?: boolean
}>()

const isLoading = ref<boolean>(false)
const recentlyActive = ref<boolean>(false)
const recentlyValue = ref<string>('asc')

const emit = defineEmits(['recently', 'toggleplay', 'shuffle'])

const onRecently = () => {
  recentlyActive.value = !recentlyActive.value

  if (recentlyActive.value) {
    recentlyValue.value = 'desc'
  } else {
    recentlyValue.value = 'asc'
  }

  emit('recently', recentlyValue.value)
}

const onAudioToggle = (song: Song, id: number | string, index: number) => {
  emit('toggleplay', { song, id, index })
}

const onShuffle = () => {
  emit('shuffle')
}

const playOrPauseBtnLabel = computed<string>(() => {
  return playerStore.playing ? t('pause') : t('play')
})

const recentlyClass = computed<string>(() => {
  return recentlyActive.value ? 'desc' : 'asc'
})
</script>

<template>
  <div class="g-music-filtered">
    <div class="g-music-filtered__header">
      <div class="g-music-filtered__label">
        {{ props.label }}
      </div>

      <div
        v-if="props.recently"
        class="g-music-filtered__recently"
        @click.prevent="onRecently"
      >
        <span>{{ props.recently }}</span>
        <DynamicIcon :class="recentlyClass" name="recently" :size="20" />
      </div>
    </div>

    <div v-if="props.action" class="g-music-filtered__footer">
      <q-btn
        :loading="isLoading"
        :label="t('gMusicFiltered.buttonShuffle')"
        class="q-btn-shuffle q-btn-large full-width icon-left"
        rounded
        text-color="''"
        unelevated
        @click.prevent="onShuffle"
      >
        <DynamicIcon class="on-left" name="shuffle" :size="20" />
      </q-btn>

      <q-btn
        :label="playOrPauseBtnLabel"
        class="q-btn-play q-btn--light-primary q-btn-large full-width icon-left"
        rounded
        text-color="''"
        unelevated
        @click.prevent="onAudioToggle(props.song, playerStore.getMusicIndex, 0)"
      >
        <DynamicIcon
          v-if="playerStore.playing"
          class="on-left"
          name="pause_over"
          :size="20"
        />
        <DynamicIcon v-else class="on-left" name="play_over" :size="20" />
      </q-btn>
    </div>
  </div>
</template>

<style scoped></style>
