import { t } from "i18next";
import { AppRoute, type FeatureFlagKey } from "lib";

// types
import type {
  IsFeatureEnabled,
  NamedViewPageType,
  ViewPageType,
} from "./types";

export const PageId = {
  Home: "home",
  PeriodLog: "period-log",
  History: "history",
  Profile: "profile",
  About: "about",
  CookiesPolicy: "cookies-policy",
  TermsAndConditions: "terms-and-conditions",
  PrivacyPolicy: "privacy-policy",
  NotFound: "not-found",
} as const;

export type PageId = (typeof PageId)[keyof typeof PageId];

export const sitemap: ViewPageType[] = [
  {
    key: PageId.Home,
    path: AppRoute.Home,
  },
  {
    key: PageId.PeriodLog,
    path: AppRoute.PeriodLog,
  },
  {
    key: PageId.History,
    path: AppRoute.History,
  },
  {
    key: PageId.Profile,
    path: AppRoute.Profile,
  },
  {
    key: PageId.About,
    path: AppRoute.About,
  },
  {
    key: PageId.CookiesPolicy,
    path: AppRoute.CookiesPolicy,
  },
  {
    key: PageId.TermsAndConditions,
    path: AppRoute.TermsAndConditions,
  },
  {
    key: PageId.PrivacyPolicy,
    path: AppRoute.PrivacyPolicy,
  },
  {
    key: PageId.NotFound,
    path: `/${AppRoute.NotFound}`,
  },
];

const pageFeatureDependencies: Partial<Record<PageId, FeatureFlagKey>> = {
  [PageId.History]: "historyEnabled",
  [PageId.PeriodLog]: "periodLogEnabled",
  [PageId.Profile]: "profileEnabled",
  [PageId.About]: "aboutEnabled",
  [PageId.CookiesPolicy]: "cookiesPolicyEnabled",
  [PageId.TermsAndConditions]: "termsAndConditionsEnabled",
  [PageId.PrivacyPolicy]: "privacyPolicyEnabled",
};

const isPageFeatureEnabled = (
  page: ViewPageType,
  isFeatureEnabled: IsFeatureEnabled,
): boolean => {
  const dependency = pageFeatureDependencies[page.key];
  if (!dependency) return true;

  return isFeatureEnabled(dependency);
};

const filterSitemapByFeatures = (
  routes: ViewPageType[],
  isFeatureEnabled: IsFeatureEnabled,
): ViewPageType[] => {
  return routes
    .filter((route) => isPageFeatureEnabled(route, isFeatureEnabled))
    .map((route) => ({
      ...route,
      children: route.children
        ? filterSitemapByFeatures(route.children, isFeatureEnabled)
        : undefined,
    }));
};

export const getFeatureFilteredSitemap = (
  isFeatureEnabled: IsFeatureEnabled,
): ViewPageType[] => {
  return filterSitemapByFeatures(sitemap, isFeatureEnabled);
};

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
