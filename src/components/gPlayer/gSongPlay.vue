<script setup lang="ts">
import { computed, defineComponent } from 'vue'

import gBack from '@/components/gBack/gBack.vue'
import { Song } from '@/types/artist'

defineComponent({
  components: {
    gBack,
  },
})

interface Props {
  currentMusic?: Song | undefined
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  currentMusic: undefined,
})

const emit = defineEmits(['hide-song-play'])

const infoLength = computed<boolean>(() => {
  return props.currentMusic?.info ? props.currentMusic?.info?.length > 0 : false
})

const allGenres = computed<string>(() => {
  let genres = props.currentMusic?.genres || []

  return genres
    .map((genre) => {
      return genre.name
    })
    .join(', ')
})
</script>

<template>
  <transition enter-active-class="fadeInDown" leave-active-class="fadeInDown">
    <div v-show="show" class="g-song-play">
      <div class="g-song-play__wrapper">
        <div class="g-song-play__header">
          <g-back icon="back" @click.prevent="emit('hide-song-play')" />

          <div class="q-page__header-actions">
            <div class="q-page__header-dropdown">
              <i class="g-icon g-icon-dropdown-menu">
                <span></span>
              </i>
            </div>
          </div>
        </div>
        <div class="g-song-play__body">
          <div class="g-song-play__info">
            <q-avatar
              class="g-song-play__info-picture"
              :class="{
                'g-song-info__picture-default': !props.currentMusic?.pic,
              }"
            >
              <template v-if="props.currentMusic?.pic">
                <img
                  :alt="props.currentMusic.title"
                  :src="props.currentMusic?.pic"
                />
              </template>
            </q-avatar>

            <h3 class="g-song-play__info-title">
              {{ props.currentMusic?.title || 'Unknown' }}
            </h3>

            <div class="g-song-play__info-artist-name">
              <span>{{ props.currentMusic?.artist || 'Untitled' }}</span>

              <span v-if="allGenres.length">, {{ allGenres }} </span>
            </div>

            <div v-if="infoLength" class="g-song-play__info-info">
              <span
                v-for="(item, index) in props.currentMusic?.info"
                :key="index"
              >
                {{ item }}
              </span>
            </div>
          </div>

          <div class="g-song-play__player">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
@import 'src/css/quasar.variables';

.g-song-play {
  top: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: $white;
  overflow: hidden;
  z-index: 101;

  &__wrapper {
    position: relative;
    overflow-y: auto;
    padding: 24px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
    min-height: 48px;

    &-title {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 20px;

      &-dropdown {
        width: 28px;
        height: 28px;
      }
    }

    &-dropdown {
      display: flex;
    }
  }

  &__body {
    position: relative;
    margin: 24px 0 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-picture {
      flex-basis: 100%;
      width: 100%;
      height: 100%;
      border-radius: 24px;

      &-default {
        background: linear-gradient(
          141.82deg,
          #42d0e1 0%,
          #f2e58d 32.64%,
          #fec856 50.01%,
          #f77e0c 78.11%,
          #f0de51 101.07%
        );
        animation: rotate-hue 6s alternate infinite;

        @keyframes rotate-hue {
          to {
            filter: hue-rotate(1turn);
          }
        }
      }
    }

    &-title {
      text-align: center;
      margin: 20px 0 0;
    }

    &-artist-name {
      margin: 12px 0 0;
      font-size: $size-18;
      font-weight: 500;
      line-height: $lh-25;
      letter-spacing: 0.2px;
      color: $greyscale800;
    }

    &-info {
      position: relative;
      margin: 12px 0 0;
      font-size: $size-14;
      font-weight: 500;
      line-height: $lh-20;
      letter-spacing: 0.2px;
      color: $greyscale700;

      & + span {
        &::before {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: -13.5px;
          content: '';
          width: 1px;
          height: calc(100% - 4px);
          background: $greyscale700;
        }
      }
    }
  }

  &__player {
    position: relative;
    margin: 20px 0 0;
    padding: 20px 0 0;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: $greyscale200;
      content: '';
    }

    .g-player-controller {
      .g-player-track-control {
        display: flex;
        flex-direction: column-reverse;

        .g-player-track-control-buttons {
          gap: 33px;
          justify-content: center;
          margin: 16px 0 0;
        }

        .g-player-track-control-bar {
          position: relative;
          flex-direction: column;

          .g-player-ptime,
          .g-player-dtime {
            position: absolute;
            bottom: 0;
          }

          .g-player-ptime {
            left: 0;
          }

          .g-player-dtime {
            right: 0;
          }

          .g-player-bar-wrap {
            order: -1;
            padding: 0 0 31px 0;

            .g-player-bar {
              height: 8px;

              .g-player-loaded,
              .g-player-played {
                height: 8px;
              }

              .g-player-played {
                .g-player-thumb {
                  position: absolute;
                  top: 0;
                  right: 0;
                  margin-top: -5px;
                  margin-right: -10px;
                  width: 18px;
                  height: 18px;
                  transform: scale(1);
                  will-change: transform;
                  -webkit-transition: background-color 0.3s, border-color 0.3s,
                    -webkit-transform 300ms;
                  transition: transform 300ms, background-color 0.3s,
                    border-color 0.3s, -webkit-transform 300ms;
                  border-radius: 50%;
                  background: linear-gradient(
                    286.17deg,
                    #cb4800 0%,
                    #ff7b33 100%
                  );
                  cursor: pointer;
                  overflow: hidden;
                }
              }
            }
          }
        }
      }
    }
  }
}

.fadeInDown {
  animation-name: fadeInDown;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
