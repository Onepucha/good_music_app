import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('layouts/home.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/index.vue') },
    ],
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Explore',
        component: () => import('pages/explore.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('layouts/simple.vue'),
    children: [
      { path: '', name: 'Login', component: () => import('pages/login.vue') },
    ],
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('layouts/simple.vue'),
    children: [
      {
        path: '',
        name: 'Register',
        component: () => import('pages/register.vue'),
      },
    ],
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import('layouts/default.vue'),
    children: [
      {
        name: 'Album',
        path: ':id',
        component: () => import('pages/album/[id]/index.vue'),
      },
    ],
  },
  {
    path: '/artist',
    name: 'Artist',
    component: () => import('layouts/default.vue'),
    children: [
      {
        name: 'Artist',
        path: '',
        component: () => import('pages/artist/index.vue'),
      },
      {
        path: ':id',
        component: () => import('pages/artist/[id]/index.vue'),
      },
      {
        path: ':id/tracks',
        component: () => import('pages/artist/[id]/tracks/index.vue'),
      },
      {
        path: ':id/track/:code',
        component: () => import('pages/artist/[id]/track/[code]/index.vue'),
      },
    ],
  },
  {
    path: '/chart',
    name: 'Chart',
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Chart',
        component: () => import('pages/chart/index.vue'),
      },
      { path: ':id', component: () => import('pages/chart/[id].vue') },
    ],
  },
  {
    path: '/forgot-password',
    name: 'Forgot password',
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Forgot password',
        component: () => import('pages/forgot-password/index.vue'),
      },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { requiresAuth: true },
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('pages/profile/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/profile/details',
        component: () => import('pages/profile/details/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/profile/edit',
        component: () => import('pages/profile/edit/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/profile/security',
        name: 'Security',
        component: () => import('pages/profile/security/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/profile/notification',
        name: 'Notification',
        component: () => import('pages/notification/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/profile/language',
        name: 'Language',
        component: () => import('pages/language/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/profile/premium',
        name: 'Premium',
        component: () => import('pages/profile/premium/index.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/reset-password',
    name: 'Reset password',
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Reset password',
        component: () => import('pages/reset-password/index.vue'),
      },
    ],
  },
  {
    path: '/releases',
    name: 'Releases',
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Releases',
        component: () => import('pages/releases/index.vue'),
      },
      { path: ':id', component: () => import('pages/releases/[id].vue') },
    ],
  },
  {
    path: '/library',
    name: 'Library',
    meta: { requiresAuth: true },
    component: () => import('layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'Library',
        component: () => import('pages/library/index.vue'),
      },
      {
        path: ':nickname',
        component: () => import('pages/library/[nickname]/index.vue'),
      },
      {
        path: ':nickname/playlists',
        name: 'Playlists',
        component: () => import('pages/library/[nickname]/playlists/index.vue'),
      },
      {
        path: ':nickname/playlists/:id',
        name: 'Playlist',
        component: () =>
          import('pages/library/[nickname]/playlists/[id]/index.vue'),
      },
      {
        path: ':nickname/downloads',
        name: 'Downloads',
        component: () => import('pages/library/[nickname]/downloads/index.vue'),
      },
      {
        path: ':nickname/albums',
        name: 'Albums',
        component: () => import('pages/library/[nickname]/albums/index.vue'),
      },
      {
        path: ':nickname/songs',
        name: 'Tracks',
        component: () => import('pages/library/[nickname]/songs/index.vue'),
      },
      {
        path: ':nickname/artists',
        name: 'Artists',
        component: () => import('pages/library/[nickname]/artists/index.vue'),
      },
      {
        path: ':nickname/artists/singers',
        name: 'Artists Singers',
        component: () =>
          import('pages/library/[nickname]/artists/singers/index.vue'),
      },
      {
        path: ':nickname/artists/albums',
        name: 'Artists Album',
        component: () =>
          import('pages/library/[nickname]/artists/albums/index.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error not found',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
