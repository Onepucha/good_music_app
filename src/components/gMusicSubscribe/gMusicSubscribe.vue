<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { defineComponent } from 'vue'
import { ItemPlan } from '@/types/options'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
  },
})

const props = defineProps<{
  item?: ItemPlan
}>()
</script>

<template>
  <q-card class="g-music-subscribe">
    <router-link :to="props.item.href">
      <div class="g-music-subscribe__wrap">
        <q-card-section>
          <div class="g-music-subscribe__title">
            <div class="g-music-subscribe__title-icon">
              <DynamicIcon :size="60" name="crown" />
            </div>
            <div class="g-music-subscribe__title-price">
              {{ props.item.price }}
              <span>{{ props.item.quantityMonths }}</span>
            </div>
          </div>

          <div class="g-music-subscribe__description">
            <ol class="g-music-subscribe__list">
              <li
                v-for="(list, index) in props.item.list"
                :key="index"
                class="g-music-subscribe__list-item"
              >
                {{ list }}
              </li>
            </ol>
          </div>
        </q-card-section>
      </div>
    </router-link>
  </q-card>
</template>

<style scoped></style>
