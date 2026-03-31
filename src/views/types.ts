import type { ReactNode } from "react";
import type { PageId } from "./sitemap";

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
  type?: "menu" | "divider";
};
