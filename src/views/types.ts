import type { ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { PageId } from "./sitemap";
import type { FeatureFlagKey } from "lib";

export type ViewPageType = {
  key: PageId;
  path: string;
  children?: ViewPageType[];
};

export interface NamedViewPageType extends ViewPageType {
  name: string;
}

export type SubMenuItemType = {
  id: string;
  label: string | ReactNode;
  path?: string;
};

export type MenuItemType<MenuKeys extends string = string> = {
  page?: MenuKeys;
  path?: string;
  icon?: ReactNode;
  auth?: boolean;
  type?: "menu" | "divider";
};

export type BottomNavItemType = {
  id: string;
  page: PageId;
  to: string;
  icon: IconDefinition;
  position: "left" | "right";
};

export type IsFeatureEnabled = (key: FeatureFlagKey) => boolean;
