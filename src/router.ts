import { type RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'

import { cachedReadLockFile } from './pages/DemoDataLoadind.data'

export const ROUTES = [
  {
    path: '/',
    component: lazy(async () => import('./pages/Home')),
    info: { title: 'Home' },
  },
  {
    path: '/demo-data-loading',
    component: lazy(async () => import('./pages/DemoDataLoading')),
    preload: () => void cachedReadLockFile(),
    info: { title: 'Data Loading' },
  },
  {
    path: '/demo-virtual-list',
    component: lazy(async () => import('./pages/DemoVirtualList')),
    info: { title: 'Virtual List' },
  },
  {
    path: '/demo-lazy-images',
    component: lazy(async () => import('./pages/DemoLazyImages')),
    info: { title: 'Lazy Images' },
  },
] as const satisfies RouteDefinition[]

export type RoutesPath = (typeof ROUTES)[number]['path']
