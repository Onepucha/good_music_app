<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue'
import { Artist } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'

defineComponent({
  components: {
    DynamicIcon,
  },
})

const emit = defineEmits(['add-follow'])

const props = defineProps<{
  artist: Artist
}>()

const follow = ref<boolean>(false)

const toggleFollow = (artist: any) => {
  follow.value = !follow.value
  emit('add-follow', artist)
}

const followBtnText = computed<string>(() => {
  return follow.value ? 'Following' : 'Follow'
})

const followBtnClass = computed<string>(() => {
  return follow.value ? 'q-btn-border' : ''
})
</script>

<template>
  <div class="g-follow-artist">
    <div class="g-follow-artist__content">
      <div
        class="g-follow-artist__picture"
        :class="{ 'g-follow-artist__picture-default': !props.artist?.imageUrl }"
      >
        <img
          v-if="props.artist?.imageUrl"
          :alt="props.artist.name"
          :src="props.artist?.imageUrl"
        />
      </div>

      <div class="g-follow-artist__title">
        <span>{{ props.artist.name }}</span>

        <DynamicIcon
          v-if="props.artist?.is_verified"
          name="verified"
          :size="20"
        />
      </div>
    </div>

    <div class="g-follow-artist__follow">
      <q-btn
        :class="followBtnClass"
        :label="followBtnText"
        class="q-btn-small"
        rounded
        text-color="''"
        unelevated
        @click.prevent="toggleFollow(props.artist)"
      />
    </div>
  </div>
</template>

<style scoped></style>
