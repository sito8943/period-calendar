import { t } from "i18next";

// @sito/dashboard-app
import type { FeatureEnabledFn, NamedViewPageType, ViewPageType } from "@sito/dashboard-app";

// lib
import { AppRoutes, type FeatureFlagKey } from "lib";

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

export const sitemap: ViewPageType<PageId>[] = [
  {
    key: PageId.Home,
    path: AppRoutes.Home,
  },
  {
    key: PageId.PeriodLog,
    path: AppRoutes.PeriodLog,
  },
  {
    key: PageId.History,
    path: AppRoutes.History,
  },
  {
    key: PageId.Profile,
    path: AppRoutes.Profile,
  },
  {
    key: PageId.About,
    path: AppRoutes.About,
  },
  {
    key: PageId.CookiesPolicy,
    path: AppRoutes.CookiesPolicy,
  },
  {
    key: PageId.TermsAndConditions,
    path: AppRoutes.TermsAndConditions,
  },
  {
    key: PageId.PrivacyPolicy,
    path: AppRoutes.PrivacyPolicy,
  },
  {
    key: PageId.NotFound,
    path: `/${AppRoutes.NotFound}`,
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
  page: ViewPageType<PageId>,
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
): boolean => {
  const dependency = pageFeatureDependencies[page.key];
  if (!dependency) return true;

  return isFeatureEnabled(dependency);
};

const filterSitemapByFeatures = (
  routes: ViewPageType<PageId>[],
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
): ViewPageType<PageId>[] => {
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
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
): ViewPageType<PageId>[] => {
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
