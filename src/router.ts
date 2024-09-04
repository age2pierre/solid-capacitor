import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import { cachedReadLockFile } from "./pages/DemoDataLoadind.data";

export const ROUTES = [
  { path: '/', component: lazy(() => import('./pages/Home')) },
  {
    path: '/demo-data-loading',
    component: lazy(() => import('./pages/DemoDataLoading')),
    preload: () => {
      cachedReadLockFile();
    },
  },
  {
    path: '/demo-dyn-list',
    component: lazy(() => import('./pages/DemoDynList')),
  },
  {
    path: '/demo-lazy-images',
    component: lazy(() => import('./pages/DemoLazyImages')),
  },
] as const satisfies RouteDefinition[];

export type RoutesPath = (typeof ROUTES)[number]['path'];
