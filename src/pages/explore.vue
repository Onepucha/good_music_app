<script lang="ts" setup>
import { defineComponent, reactive, ref } from 'vue'
import { useTranslation } from '@/composables/lang'
import DynamicIcon from '@/components/DynamicIcon.vue'
import gCardDashboard from '@/components/gCardDashboard/gCardDashboard.vue'
import { Options } from '@/types/options'
import { Dashboards } from '@/types/dashboards'
import { useAuthStore } from '@/stores'
import { useMeta } from 'quasar'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gCardDashboard,
  },
})

const authStore = useAuthStore()

interface Data {
  options: Array<Options>
  dashboards: Array<Dashboards>
}

const data: Data = reactive({
  options: [
    {
      label: 'Google',
      value: 'Google',
      description: 'Search engine',
      category: '1',
    },
    {
      label: 'Facebook',
      value: 'Facebook',
      description: 'Social media',
      category: '1',
    },
    {
      label: 'Twitter',
      value: 'Twitter',
      description: 'Quick updates',
      category: '2',
    },
    {
      label: 'Apple',
      value: 'Apple',
      description: 'iStuff',
      category: '2',
    },
    {
      label: 'Oracle',
      value: 'Oracle',
      disable: true,
      description: 'Databases',
      category: '3',
    },
  ],
  dashboards: [
    {
      id: '1',
      backgroundUrl: '/images/dashbords/charts.png',
      title: 'charts',
      href: '/chart',
    },
    {
      id: '2',
      backgroundUrl: '/images/dashbords/podcasts.png',
      title: 'podcasts',
      href: '/podcasts',
    },
    {
      id: '3',
      backgroundUrl: '/images/dashbords/newReleases.png',
      title: 'newReleases',
      href: '/releases',
    },
    {
      id: '4',
      backgroundUrl: '/images/dashbords/onlyYou.png',
      title: 'onlyYou',
      href: '/onlyYou',
    },
    {
      id: '5',
      backgroundUrl: '/images/dashbords/pop.png',
      title: 'pop',
      href: '/pop',
    },
    {
      id: '6',
      backgroundUrl: '/images/dashbords/kPop.png',
      title: 'kPop',
      href: '/kPop',
    },
    {
      id: '7',
      backgroundUrl: '/images/dashbords/rock.png',
      title: 'rock',
      href: '/rock',
    },
    {
      id: '8',
      backgroundUrl: '/images/dashbords/hipHop.png',
      title: 'hipHop',
      href: '/hipHop',
    },
    {
      id: '9',
      backgroundUrl: '/images/dashbords/jazz.png',
      title: 'jazz',
      href: '/jazz',
    },
    {
      id: '10',
      backgroundUrl: '/images/dashbords/romance.png',
      title: 'romance',
      href: '/romance',
    },
  ],
})

useMeta(() => {
  return {
    title: t('pages.explore.titleHead'),
    meta: {
      description: {
        name: 'description',
        content: t('pages.explore.contentHead'),
      },
    },
  }
})

const options = ref<Array<Options>>(data.options)
const model = ref<string | null>(null)

const filterFn = (val: string, update: any) => {
  setTimeout(() => {
    update(() => {
      if (val === '') {
        options.value = data.options
      } else {
        const needle = val.toLowerCase()
        options.value = data.options.filter(
          (v: any) => v.label.toLowerCase().indexOf(needle) > -1
        )
      }
    })
  }, 1500)
}

const abortFilterFn = () => {
  console.log('delayed filter aborted')
}

const openSearch = () => {
  authStore.searchModal = true
}
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12">
        <div class="g-explore">
          <div class="g-explore__wrap">
            <div class="q-page__header">
              <q-item class="q-page__header-title" to="/">
                <i class="g-icon g-icon-logo"></i>
                <h4>{{ t('pages.explore.titleHeader') }}</h4>
              </q-item>

              <div class="q-page__header-dropdown">
                <i class="g-icon g-icon-dropdown-menu">
                  <span></span>
                </i>
              </div>
            </div>

            <div class="g-explore__body">
              <div class="g-explore__search" @click.prevent="openSearch">
                <q-select
                  v-model="model"
                  :label="t('pages.explore.searchLabel')"
                  :options="options"
                  class="q-search"
                  clearable
                  fill-input
                  hide-selected
                  input-debounce="0"
                  outlined
                  use-input
                  @filter="filterFn"
                  @filter-abort="abortFilterFn"
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar> 1231</q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption
                          >{{ scope.opt.description }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template #prepend>
                    <DynamicIcon :size="20" name="search" />
                  </template>

                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="g-explore__dashboard">
                <g-card-dashboard
                  v-for="(item, index) in data.dashboards"
                  :key="index"
                  :item="item"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
