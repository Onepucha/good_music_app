<script lang="ts" setup>
import { useTranslation } from '@/composables/lang'
import { defineComponent, reactive, ref } from 'vue'
import { Song } from '@/types/artist'

import DynamicIcon from '@/components/DynamicIcon.vue'
// import gPlayer from '@/components/gPlayer/gPlayer.vue'
// import gPodcastList from '@/components/gPodcastList/gPodcastList.vue'
// import gPaymentMethods from '@/components/gPaymentMethods/gPaymentMethods.vue'
// import gPlayOverscreen from '@/components/gPlayOverscreen/gPlayOverscreen.vue'
// import gPlaylistHeader from '@/components/gPlaylistHeader/gPlaylistHeader.vue'
// import Readmore from '@/components/Readmore.vue'
// import gAlbumProfiles from '@/components/gAlbumProfiles/gAlbumProfiles.vue'

const { t } = useTranslation()

defineComponent({
  components: {
    DynamicIcon,
  },
})

interface Data {
  volume: number
  muted: boolean
  music: Song
  list: Array<Song>
  options: any
  song: Song
}

const data: Data = reactive({
  volume: 1,
  muted: false,
  music: {
    _id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    src: 'https://docs.google.com/uc?id=0BwNMrKZzPF-aT09VS2R3NU91UzQ&export=download',
    pic: '/audio/avatars/The_Weeknd.jpeg',
    code: '1',
  },
  list: [
    {
      _id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      src: '/audio/The_Weeknd_Blinding_Lights.mp3',
      pic: '/audio/avatars/The_Weeknd.jpeg',
      code: '1',
    },
    {
      _id: '2',
      title: '7 rings',
      artist: 'Ariana Grande',
      src: '/audio/Ariana_Grande_7_rings.mp3',
      pic: '/audio/avatars/Ariana_Grande.jpeg',
      code: '2',
    },
    {
      _id: '3',
      title: 'WITHOUT YOU',
      artist: 'The Kid LAROI.',
      src: '/audio/The_Kid_LAROI_WITHOUT_YOU.mp3',
      pic: '/audio/avatars/The_Kid_LAROI.jpeg',
      code: '3',
    },
  ],
  song: {
    _id: '1',
    imageUrl: '/images/albums/handsome.png',
    name: 'HANDSOME',
    artist: 'Warren Hue',
    src: '/',
    code: '4',
  },
  options: [
    {
      default: [
        { label: 'PayPal', value: 'payPal' },
        { label: 'Google Pay', value: 'googlePay' },
        { label: 'Apple Pay', value: 'applePay' },
        { label: 'Mastercard', value: 'mastercard' },
        { label: 'Cash Money', value: 'wallet' },
      ],
    },
    {
      crypto: [
        { label: 'Monero - XMR', value: 'monero' },
        { label: 'Monero - XMR', value: 'monero' },
      ],
    },
    {
      fiat: [{ label: 'Apple Pay', value: 'applePay' }],
    },
  ],
})

const payment = ref<string>('')
</script>

<template>
  <div class="q-page">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="g-library">
          <div class="q-page__header">
            <q-item class="q-page__header-title" to="/">
              <i class="g-icon g-icon-logo"></i>
              <h4>{{ t('pages.library.titleHeader') }}</h4>
            </q-item>

            <div class="q-page__header-actions">
              <DynamicIcon name="search" :size="28" />

              <div class="q-page__header-dropdown">
                <i class="g-icon g-icon-dropdown-menu">
                  <span></span>
                </i>
              </div>
            </div>
          </div>

          <q-list class="g-library__nav">
            <q-item to="/playlists">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="playlists" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.playlists') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item to="/downloads">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="downloads" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.downloads') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item to="/albums">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="albums" />
              </q-item-section>

              <q-item-section
                >{{ t('pages.library.navs.albums') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item to="/songs">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="songs" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.songs') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>

            <q-item to="/artist">
              <q-item-section avatar>
                <DynamicIcon :size="28" name="artists" />
              </q-item-section>

              <q-item-section>
                {{ t('pages.library.navs.artists') }}
              </q-item-section>

              <q-item-section side>
                <DynamicIcon :size="20" name="right" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!--        <g-player :music="data.music" />-->

        <!--        <g-player-->
        <!--          shuffle-->
        <!--          repeat="list"-->
        <!--          :muted="data.muted"-->
        <!--          :volume="data.volume"-->
        <!--          :music="data.list[0]"-->
        <!--          :list="data.list"-->
        <!--          :theme="'pic'"-->
        <!--        />-->

        <!--        <g-podcast-list :playing="false" />-->

        <!--        <template v-for="(item, index) in data.options" :key="index">-->
        <!--          <div class="g-payment-methods">-->
        <!--            <div v-if="item.crypto" class="g-payment-methods__label">-->
        <!--              Crypto:-->
        <!--            </div>-->
        <!--            <div v-else-if="item.fiat" class="g-payment-methods__label">-->
        <!--              Fiat money:-->
        <!--            </div>-->
        <!--            <div v-else class="g-payment-methods__label">-->
        <!--              Select the payment method you want to use.-->
        <!--            </div>-->

        <!--            <template-->
        <!--              v-for="(paymentCrypto, indexCrypto) in item.crypto"-->
        <!--              :key="indexCrypto"-->
        <!--            >-->
        <!--              <g-payment-methods v-if="item.crypto" :payment="paymentCrypto">-->
        <!--                <template #radio>-->
        <!--                  <q-radio v-model="payment" :val="paymentCrypto" />-->
        <!--                </template>-->
        <!--              </g-payment-methods>-->
        <!--            </template>-->

        <!--            <template-->
        <!--              v-for="(paymentFiat, indexFiat) in item.fiat"-->
        <!--              :key="indexFiat"-->
        <!--            >-->
        <!--              <g-payment-methods v-if="item.fiat" :payment="paymentFiat">-->
        <!--                <template #radio>-->
        <!--                  <q-radio v-model="payment" :val="paymentFiat" />-->
        <!--                </template>-->
        <!--              </g-payment-methods>-->
        <!--            </template>-->

        <!--            <template-->
        <!--              v-for="(paymentDefault, indexDefault) in item.default"-->
        <!--              :key="indexDefault"-->
        <!--            >-->
        <!--              <g-payment-methods-->
        <!--                v-if="!item.crypto && !item.fiat"-->
        <!--                :payment="paymentDefault"-->
        <!--              >-->
        <!--                <template #radio>-->
        <!--                  <q-radio v-model="payment" :val="paymentDefault" />-->
        <!--                </template>-->
        <!--              </g-payment-methods>-->
        <!--            </template>-->
        <!--          </div>-->
        <!--        </template>-->

        <!--        <g-play-overscreen :item="data.song" />-->

        <!--        <g-playlist-header :playing="false" />-->

        <!--        <Readmore-->
        <!--          :slice="20"-->
        <!--          :long-text="'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad'"-->
        <!--        />-->

        <!--                <g-album-profiles />-->
      </div>
    </div>
  </div>
</template>
