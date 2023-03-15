import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/home.vue'),
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
    children: [
      { path: '', component: () => import('pages/albums/index.vue') },
      { path: ':id', component: () => import('pages/albums/[id].vue') },
    ],
  },
  {
    path: '/artist',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/artist/index.vue') },
      { path: ':id', component: () => import('pages/artist/[id]/index.vue') },
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
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/chart/index.vue') },
      { path: ':id', component: () => import('pages/chart/[id].vue') },
    ],
  },
  {
    path: '/downloads',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/downloads/index.vue') },
    ],
  },
  {
    path: '/forgot-password',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/forgot-password/index.vue') },
    ],
  },
  {
    path: '/language',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/language/index.vue') },
    ],
  },
  {
    path: '/notification',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/notification/index.vue') },
    ],
  },
  {
    path: '/playlists',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/playlists/index.vue') },
    ],
  },
  {
    path: '/profile',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/profile/index.vue') },
      {
        path: '/profile/details',
        component: () => import('pages/profile/details/index.vue'),
      },
      {
        path: '/profile/edit',
        component: () => import('pages/profile/edit/index.vue'),
      },
    ],
  },
  {
    path: '/reset-password',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/reset-password/index.vue') },
    ],
  },
  {
    path: '/security',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/security/index.vue') },
    ],
  },
  {
    path: '/songs',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/songs/index.vue') },
      { path: ':id', component: () => import('pages/songs/[id].vue') },
    ],
  },
  {
    path: '/releases',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/releases/index.vue') },
      { path: ':id', component: () => import('pages/releases/[id].vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
