import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/index.vue') }],
  },
  {
    path: '/explore',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/explore.vue') }],
  },
  {
    path: '/library',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/library.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/simple.vue'),
    children: [{ path: '', component: () => import('pages/login.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/simple.vue'),
    children: [{ path: '', component: () => import('pages/register.vue') }],
  },
  {
    path: '/albums',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/albums.vue') }],
  },
  {
    path: '/artist',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/artist.vue') },
      { path: ':id', component: () => import('pages/artist/[id]/index.vue') },
    ],
  },
  {
    path: '/chart',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/chart.vue') }],
  },
  {
    path: '/downloads',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/downloads.vue') }],
  },
  {
    path: '/forgot-password',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/forgot-password.vue') },
    ],
  },
  {
    path: '/language',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/language.vue') }],
  },
  {
    path: '/notification',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/notification.vue') }],
  },
  {
    path: '/playlists',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/playlists.vue') }],
  },
  {
    path: '/profile',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/profile.vue') }],
  },
  {
    path: '/reset-password',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/reset-password.vue') },
    ],
  },
  {
    path: '/security',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/security.vue') }],
  },
  {
    path: '/songs',
    component: () => import('layouts/default.vue'),
    children: [{ path: '', component: () => import('pages/songs.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
