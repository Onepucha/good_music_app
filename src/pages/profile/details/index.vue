<script lang="ts" setup>
import { defineComponent, onMounted, reactive } from 'vue'

import DynamicIcon from '@/components/DynamicIcon.vue'
import gBack from '@/components/gBack/gBack.vue'
import gMusicGalleryList from '@/components/gMusicGallery/gMusicGalleryList.vue'
import { useTranslation } from '@/composables/lang'
import { useAuthStore, useLoadingStore } from '@/stores'
import PlaylistsApi from '@/services/playlists'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
    gBack,
    gMusicGalleryList,
  },
})

const authStore = useAuthStore()
const loadingStore = useLoadingStore()

interface Data {
  avatar: string
  fullname: string
  playlists: string[] | undefined
  isLoading: boolean
}

const data: Data = reactive({
  avatar: authStore?.user?.avatar || '',
  fullname: authStore?.user?.fullname || '',
  playlists: [],
  isLoading: false,
})

const getPlaylists = async () => {
  try {
    const response: any = await PlaylistsApi.getLikedYour({
      count: 6,
    })

    data.playlists = response.data.playlists
  } catch (error: unknown) {
    console.error(error)
  }
}

onMounted(async () => {
  loadingStore.setLoading()
  await getPlaylists()
  loadingStore.hideLoading()
})
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12">
        <div class="g-profile-details">
          <div class="g-profile-details__wrap">
            <div class="q-page__header">
              <g-back
                :label="t('pages.profile.details.buttonBackProfileDetails')"
                href="/profile"
                icon="back"
              />

              <router-link to="/profile/edit">
                <DynamicIcon :size="28" name="pen" />
              </router-link>
            </div>

            <div class="g-profile-details__header">
              <div class="g-profile-details__generic">
                <div class="g-profile-details__generic-head">
                  <q-avatar
                    :size="'200px'"
                    class="g-profile-details__user-default"
                  >
                    <template v-if="data.avatar">
                      <img :alt="data.fullname" :src="data.avatar" />
                    </template>
                  </q-avatar>

                  <h3 class="g-profile-details__user-title">
                    {{ data.fullname }}
                  </h3>

                  <q-btn
                    :label="t('pages.profile.details.buttonEditProfile')"
                    class="g-profile-details__user-btn q-btn-border q-btn-medium"
                    rounded
                    text-color="''"
                    to="/profile/edit"
                    unelevated
                  />
                </div>

                <div class="g-profile-details__generic-main">
                  <div class="g-profile-details__user-info">
                    <div class="g-profile-details__user-info-comments">
                      <h4>15</h4>
                      <span>{{ t('pages.profile.details.infoComments') }}</span>
                    </div>

                    <div class="g-profile-details__user-info-likes">
                      <h4>206</h4>
                      <span>{{ t('pages.profile.details.infoLikes') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="g-profile-details__body">
              <g-music-gallery-list
                :list="data.playlists"
                :sub-title="
                  t('pages.profile.details.galleryListPlaylists.subTitle')
                "
                :title="t('pages.profile.details.galleryListPlaylists.title')"
                :type="`/library/${authStore.user?.nickname}/playlists`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
