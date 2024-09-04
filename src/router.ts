import { type RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

import { cachedReadLockFile } from "./pages/DemoDataLoadind.data";

export const ROUTES = [
  { path: '/', component: lazy(async () => import('./pages/Home')) },
  {
    path: '/demo-data-loading',
    component: lazy(async () => import('./pages/DemoDataLoading')),
    preload: () => {
      void cachedReadLockFile();
    },
  },
  {
    path: '/demo-dyn-list',
    component: lazy(async () => import('./pages/DemoDynList')),
  },
  {
    path: '/demo-lazy-images',
    component: lazy(async () => import('./pages/DemoLazyImages')),
  },
] as const satisfies RouteDefinition[];

export type RoutesPath = (typeof ROUTES)[number]['path'];
