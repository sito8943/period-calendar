import { faHome, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

// lib
import { AppRoutes, type FeatureFlagKey } from "lib";

// sitemap
import { PageId } from "./sitemap";

// @sito/dashboard-app
import {
  filterNavigationByFeatureFlags,
  type BottomNavItemType,
  type FeatureEnabledFn,
} from "@sito/dashboard-app";

export const bottomMap: BottomNavItemType<PageId>[] = [
  {
    id: "home",
    page: PageId.Home,
    to: AppRoutes.Home,
    icon: faHome,
    position: "left",
  },
  {
    id: "history",
    page: PageId.History,
    to: AppRoutes.History,
    icon: faClockRotateLeft,
    position: "right",
  },
];

const bottomFeatureDependencies: Partial<Record<PageId, FeatureFlagKey>> = {
  [PageId.History]: "historyEnabled",
};

export const getFeatureFilteredBottomMap = (
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
): BottomNavItemType<PageId>[] => {
  return filterNavigationByFeatureFlags(
    bottomMap,
    isFeatureEnabled,
    bottomFeatureDependencies,
  );
};
