<script setup lang="ts">
import { defineComponent, reactive } from 'vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { useUsersStore } from '@/stores'

const usersStore = useUsersStore()

defineComponent({
  components: {
    DynamicIcon,
  },
})

interface Data {
  menuTheme: boolean
}

const data: Data = reactive({
  menuTheme: usersStore.menuTheme,
})

const emit = defineEmits(['music-speed', 'sleep-time', 'app-share'])

const props = defineProps<{
  theme?: string
  hasControls?: boolean
  playing?: boolean
}>()
</script>

<template>
  <div class="g-player-controller-bottom">
    <div class="g-player-track-control">
      <div class="g-player-track-control-buttons">
        <DynamicIcon
          name="music_speed"
          :size="28"
          @click.prevent="emit('music-speed')"
        />

        <DynamicIcon
          name="sleep_time"
          :size="28"
          @click.prevent="emit('sleep-time')"
        />

        <DynamicIcon
          name="app_share"
          :size="28"
          @click.prevent="emit('app-share')"
        />

        <i class="g-icon g-icon-dots" @click.prevent.stop="">
          <span></span>

          <q-menu
            class="popover-menu"
            fit
            :dark="data.menuTheme"
            anchor="bottom right"
          >
            <q-list>
              <q-item
                v-if="authStore.user && props.song"
                v-close-popup
                clickable
                @click.prevent="dontPlayThis"
              >
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="dont_play" />
                </q-item-section>

                <q-item-section>
                  {{ t('gAlbumProfiles.dontPlayThis') }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click.prevent="viewArtist">
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="artist" />
                </q-item-section>

                <q-item-section>
                  {{ t('gAlbumProfiles.viewArtist') }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click.prevent="setShare">
                <q-item-section avatar>
                  <DynamicIcon :size="20" name="share" />
                </q-item-section>

                <q-item-section>
                  {{ t('gAlbumProfiles.share') }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </i>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.g-player-controller-bottom {
  position: relative;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  margin: 16px 0 0;
  padding: 0 24px;

  .g-player-bar-wrap {
    display: flex;
    width: 100%;
  }

  .g-player-track-control {
    position: relative;
    width: 100%;

    .g-player-track-control-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;

      @media #{$mobile} {
        gap: 16px;
        justify-content: space-between;
      }
    }

    .g-icon {
      cursor: pointer;
      user-select: none;

      &-dots {
        width: 28px;
        height: 28px;
      }

      @include hover-supported {
        path {
          fill: $primary;
        }
      }
    }
  }
}
</style>
