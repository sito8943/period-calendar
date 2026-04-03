import { t } from "i18next";

// types
import type { NamedViewPageType, ViewPageType } from "./types";

export const PageId = {
  Home: "home",
  PeriodLog: "period-log",
  History: "history",
  Profile: "profile",
  NotFound: "not-found",
} as const;

export type PageId = (typeof PageId)[keyof typeof PageId];

export const sitemap: ViewPageType[] = [
  {
    key: PageId.Home,
    path: "/",
  },
  {
    key: PageId.PeriodLog,
    path: "/log",
  },
  {
    key: PageId.History,
    path: "/history",
  },
  {
    key: PageId.Profile,
    path: "/profile",
  },
  {
    key: PageId.NotFound,
    path: "/*",
  },
];

const pathMap = sitemap.reduce(
  (acc, { key, path }) => {
    acc[key] = path;
    return acc;
  },
  {} as Record<PageId, string>,
);

export const getPathByKey = (key: PageId): string | undefined => pathMap[key];

export const flattenSitemap = (
  routes: ViewPageType[],
  basePath = "",
): NamedViewPageType[] => {
  const result = [];

  for (const route of routes) {
    const fullPath = `${basePath.replace(/\/$/, "")}${route.path}`;
    const name = t(`_pages:pages.${route.key}`);
    result.push({ key: route.key, path: fullPath, name });

    if (route.children)
      result.push(...flattenSitemap(route.children, fullPath));
  }

  return result;
};
