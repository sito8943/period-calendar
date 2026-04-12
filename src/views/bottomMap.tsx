import { faHome, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { AppRoute, type FeatureFlagKey } from "lib";
import { PageId } from "./sitemap";
import type { BottomNavItemType, IsFeatureEnabled } from "./types";

export const bottomMap: BottomNavItemType[] = [
  {
    id: "home",
    page: PageId.Home,
    to: AppRoute.Home,
    icon: faHome,
    position: "left",
  },
  {
    id: "history",
    page: PageId.History,
    to: AppRoute.History,
    icon: faClockRotateLeft,
    position: "right",
  },
];

const bottomFeatureDependencies: Partial<Record<PageId, FeatureFlagKey>> = {
  [PageId.History]: "historyEnabled",
};

export const getFeatureFilteredBottomMap = (
  isFeatureEnabled: IsFeatureEnabled,
): BottomNavItemType[] => {
  return bottomMap.filter((item) => {
    const dependency = bottomFeatureDependencies[item.page];
    if (!dependency) return true;

    return isFeatureEnabled(dependency);
  });
};
