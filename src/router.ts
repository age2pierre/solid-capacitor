import { type RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'

import { cachedGenerateRandomString } from '#/pages/DemoDataLoadind.data'

export const ROUTES = [
  {
    path: '/',
    component: lazy(async () => import('./pages/Home')),
    info: { title: '🏡 Home' },
  },
  {
    path: '/demo-data-loading',
    component: lazy(async () => import('./pages/DemoDataLoading')),
    preload: () => void cachedGenerateRandomString(8),
    info: { title: '📊 Data Loading' },
  },
  {
    path: '/demo-virtual-list',
    component: lazy(async () => import('./pages/DemoVirtualList')),
    info: { title: '🖼️ Virtual List' },
  },
  {
    path: '/demo-lazy-images',
    component: lazy(async () => import('./pages/DemoLazyImages')),
    info: { title: '🖼️ Lazy Images' },
  },
] as const satisfies RouteDefinition[]

export type RoutesPath = (typeof ROUTES)[number]['path']
