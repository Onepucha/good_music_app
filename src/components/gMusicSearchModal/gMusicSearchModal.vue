<script setup lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
} from 'vue'
import gLoader from '@/components/gLoader/gLoader.vue'
import gBack from '@/components/gBack/gBack.vue'
import gInput from '@/components/gInput/gInput.vue'
import gMusicSong from '@/components/gMusicSong/gMusicSong.vue'
import gMusicPlaylist from '@/components/gMusicPlaylist/gMusicPlaylist.vue'
import gFollowArtist from '@/components/gFollowArtist/gFollowArtist.vue'
import gMusicAlbumItem from '@/components/gMusicAlbumItem/gMusicAlbumItem.vue'

import { useTranslation } from '@/composables/lang'
import { Artist, Playlists, Song } from '@/types/artist'
import { useAlertStore, usePlayerStore } from '@/stores'
import { useRouter } from 'vue-router'
import Songs from '@/services/songs'
import PlaylistsApi from '@/services/playlists'
import Artists from '@/services/artists'
import Global from '@/services/global'
import { debounce } from 'quasar'
import { downloadSong } from '@/utils/utils'

const { t } = useTranslation()
const router = useRouter()
const playerStore = usePlayerStore()
const alertStore = useAlertStore()

defineComponent({
  components: {
    gLoader,
    gBack,
    gInput,
    gMusicSong,
    gMusicPlaylist,
    gFollowArtist,
    gMusicAlbumItem,
  },
})

interface Data {
  searchList: any
  playlist?: Playlists | undefined
  followArtistList: string[] | any
  songPlaylist: string[] | any
}

const data: Data = reactive({
  searchList: [],
  playlist: undefined,
  followArtistList: [],
  songPlaylist: undefined,
})

const MAX_RECENT_SEARCHES = 10

const tab = ref<string>('songs')
const searchQuery = ref<string>('')
const searchResults = ref<any>([])
const maximizedToggle = ref<boolean>(true)
const dialogAddModal = ref<boolean>(false)
const recentSearches = ref<string[]>([])
const recentSearchesVisible = ref<boolean>(true)
const showNotFound = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const categoryName = ref<string>('song')
const categories = ref([
  {
    _id: '1',
    label: t('gMusicSearch.filters.songs'),
    type: 'song',
    active: true,
  },
  {
    _id: '2',
    label: t('gMusicSearch.filters.artists'),
    type: 'artist',
    active: false,
  },
  {
    _id: '3',
    label: t('gMusicSearch.filters.albums'),
    type: 'album',
    active: false,
  },
  {
    _id: '4',
    label: t('gMusicSearch.filters.playlists'),
    type: 'playlist',
    active: false,
  },
])

const listClass = computed<any>(() => {
  return {
    'g-music-search__song-list': categoryName.value === 'song',
    'g-music-search__album-list': categoryName.value === 'album',
    'g-music-search__artist-list': categoryName.value === 'artist',
    'g-music-search__playlist-list': categoryName.value === 'playlist',
  }
})

const getSearch = async () => {
  try {
    const query = { name: searchQuery.value, type: categoryName.value }
    const response = await Global.getAll(query)
    isLoading.value = false
    return response.data
  } catch (error: unknown) {
    console.error(error)
    isLoading.value = false
    searchResults.value = []
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const search = async () => {
  isLoading.value = true
  searchResults.value = []

  if (searchQuery.value.length < 3) {
    isLoading.value = false
    searchResults.value = []
    recentSearchesVisible.value = true
    return
  }

  const fetchSearch = debounce(async () => {
    const results = await getSearch()

    searchResults.value = results?.list?.filter((result: any) => {
      return result.data.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    })
  }, 500)

  fetchSearch()
  showNotFound.value = true
}

const toggleFilter = (categoryId: string, type: string) => {
  categoryName.value = type
  categories.value.forEach((category: any) => {
    category.active = category._id === categoryId
  })
  search()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  recentSearchesVisible.value = true
  showNotFound.value = false
}

const recentSearchClick = (recentSearch: any) => {
  searchQuery.value = recentSearch
  recentSearchesVisible.value = false
  search()
}

const removeRecentSearch = (index: number) => {
  recentSearches.value.splice(index, 1)
  // Update stored recent searches
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const clearRecentSearches = () => {
  recentSearches.value = []
  showNotFound.value = false
  // Update stored recent searches
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const addRecentSearch = () => {
  if (searchQuery.value.length > 0) {
    // Check if search query already exists in recent searches
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.push(searchQuery.value)
    }

    // Limit recent searches to MAX_RECENT_SEARCHES
    recentSearches.value.splice(
      0,
      recentSearches.value.length - MAX_RECENT_SEARCHES
    )

    // Update stored recent searches
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
    search()
  }
}

const onAudioToggle = (item: {
  song: Song
  id: number | string
  index: number
}) => {
  if (playerStore.playing && playerStore.getMusicIndex === item.id) {
    onAudioPause()
  } else {
    if (
      playerStore.getMusicIndex !== null &&
      playerStore.getMusicIndex === item.id
    ) {
      playerStore.setPlaying(true)

      nextTick(() => {
        playerStore.player.play()
      })
    } else {
      onAudioPlay({ song: item.song, id: item.id, index: item.index })
    }
  }
}

const onAudioPlay = async (item: {
  song: Song
  id: number | string
  index: number
}) => {
  try {
    playerStore.setLoading(true)
    const songUrl = await Songs.playSong(item.song._id)

    playerStore.setMusicList(data.songPlaylist || [])

    playerStore.setMusic(
      {
        _id: item.song?._id,
        title: item.song?.name,
        artist: item.song?.artists?.at(0),
        album: item.song?.album_code?.split('-')[1].trim(),
        src: songUrl.data?.url,
        pic: item.song?.cover_src,
        is_liked: item.song?.is_liked,
        genres: item.song?.genres,
        duration: item.song?.duration,
        release_date: item.song?.release_date,
      } as Song,
      item.id as number
    )
    playerStore.setPlaying(true)

    nextTick(() => {
      playerStore.player.play()
    })
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const onAudioPause = () => {
  playerStore.setPlaying(false)
  playerStore.player.pause()
}

const viewArtist = (url: string) => {
  router.push(`/artist/${url}`)
}

const goToAlbum = (url: string) => {
  router.push(`/album/${url}`)
}

const dontPlayThis = (song: Song) => {
  console.log(song)
}

const addPlayList = (song: Song) => {
  dialogAddModal.value = true
  data.songPlaylist = song
}

const addPlaylistSong = async (playlist: Playlists) => {
  await editPlaylist(playlist)
}

const editPlaylist = async (playlist: Playlists) => {
  try {
    let payload = {
      public: playlist.public,
      name: playlist.name,
      songs: [data.songPlaylist?._id],
      is_add_to_liked: true,
    }

    await PlaylistsApi.editPlaylist(playlist._id, payload)
    dialogAddModal.value = false
    alertStore.success(t('success'))
  } catch (error: unknown) {
    dialogAddModal.value = false
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
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

    const index = searchResults.value?.findIndex(
      (song: { type: string; data: Song }) =>
        song?.data?._id === object.ids.at(0)
    )

    if (index !== undefined) {
      searchResults.value[index].data.is_liked = object.is_add_to_liked
    }

    if (searchResults.value[index].data.is_liked) {
      alertStore.success(t('successLiked'))
    } else {
      alertStore.success(t('successNotLiked'))
    }
  } catch (error: unknown) {
    console.error(error)
  }
}

const addFollow = async (artist: Artist, follow: boolean) => {
  try {
    const isFollowItem: Array<Artist> = searchResults.value.filter(
      (item: { type: string; data: Artist }) => item.data._id === artist?._id
    )

    await saveFollowArtist(follow, [artist._id])

    isFollowItem[0].is_liked = follow

    if (isFollowItem[0].is_liked) {
      alertStore.success(t('successLiked'))
    } else {
      alertStore.success(t('successNotLiked'))
    }
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      alertStore.error(error.message)
    }
  }
}

const saveFollowArtist = async (is_follow: boolean, ids: string[]) => {
  await Artists.setFollow(ids, is_follow)
}

// Retrieve recent searches from storage on mount
onMounted(() => {
  const storedRecentSearches = localStorage.getItem('recentSearches')
  if (storedRecentSearches) {
    recentSearches.value = JSON.parse(storedRecentSearches)
  }
})
</script>

<template>
  <q-dialog
    class="g-music-search-modal"
    :maximized="maximizedToggle"
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card>
      <div class="g-music-search">
        <div class="g-music-search__header">
          <div class="g-music-search__input">
            <g-back v-close-popup icon="back" @click.prevent="clearSearch" />
            <g-input
              v-model="searchQuery"
              clearable
              clear-icon="close"
              :icon-class="'search'"
              :placeholder="t('gMusicSearch.searchLabel')"
              standout
              @keyup.enter="addRecentSearch"
              @clear="clearSearch"
            />
          </div>

          <div v-if="recentSearches.length >= 0" class="g-music-search__filter">
            <q-btn
              v-for="category in categories"
              :id="category._id"
              :key="category._id"
              :label="category.label"
              class="q-btn-small"
              :class="category.active ? '' : 'q-btn-border'"
              rounded
              text-color="''"
              unelevated
              @click="toggleFilter(category._id, category.type)"
            />
          </div>
        </div>

        <div class="g-music-search__content scroll">
          <div
            v-if="
              recentSearchesVisible &&
              recentSearches.length > 0 &&
              searchResults.length === 0 &&
              !isLoading
            "
            class="g-music-search__recent"
          >
            <div class="g-music-search__recent-header">
              <h5>Recent searches:</h5>
              <div
                v-show="recentSearches.length > 0"
                class="g-link"
                @click="clearRecentSearches()"
              >
                Clear all
              </div>
            </div>
            <q-list class="g-music-search__recent-list">
              <q-item
                v-for="(recentSearch, index) in recentSearches"
                :key="index"
                class="g-music-search__recent-list-item"
                clickable
                @click="recentSearchClick(recentSearch)"
              >
                <q-item-section>{{ recentSearch }}</q-item-section>
                <q-item-section side>
                  <span
                    class="g-music-search__recent__close"
                    @click.stop="removeRecentSearch(index)"
                  >
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div v-if="searchResults?.length > 0" :class="listClass">
            <template v-for="(result, index) in searchResults" :key="result.id">
              <template v-if="result.type === 'song'">
                <g-music-song
                  :key="result.data._id"
                  :artist="result.data?.artists?.at(0)"
                  :artist-id="result.data?.artists?.at(0)?._id"
                  :song="result.data"
                  @toggleplay="
                    onAudioToggle({
                      song: result.data,
                      id: result.data._id,
                      index: index,
                    })
                  "
                  @set-liked="setLiked"
                  @download="downloadSong"
                  @view-artist="viewArtist"
                  @go-to-album="goToAlbum"
                  @add-playlist="addPlayList"
                  @dont-play-this="dontPlayThis"
                />
              </template>

              <template v-if="result.type === 'artist'">
                <g-follow-artist
                  redirect
                  :artist="result.data"
                  @add-follow="addFollow"
                />
              </template>

              <template v-if="result.type === 'album'">
                <g-music-album-item :album="result.data" />
              </template>

              <template v-if="result.type === 'playlist'">
                <g-music-playlist :playlist="result.data" />
              </template>
            </template>
          </div>
          <g-loader v-if="isLoading" />
          <div
            v-else-if="searchResults?.length === 0"
            class="g-music-search__not-found"
          >
            <template v-if="showNotFound">
              <div class="g-music-search__not-found-images">
                <img src="/images/not-found-songs.svg" alt="not-found-songs" />
              </div>
              <h4 class="g-music-search__not-found-title">
                {{ t('gMusicSearch.titleNotFound') }}
              </h4>
              <p
                class="g-music-search__not-found-description"
                v-html="t('gMusicSearch.descriptionNotFound')"
              ></p>
            </template>
            <template v-else>
              <p
                class="g-music-search__not-found-requested"
                v-html="t('gMusicSearch.descriptionRequested')"
              ></p>
            </template>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
