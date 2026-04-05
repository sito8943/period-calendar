/* eslint-disable react-refresh/only-export-components */
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClockRotateLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { AppRoute } from "lib";

// types
import type { MenuItemType } from "./types";

export const MenuKeys = {
  Home: "home",
  History: "history",
  PeriodLog: "period-log",
  Profile: "profile",
} as const;

export type MenuKeys = (typeof MenuKeys)[keyof typeof MenuKeys];

export const menuMap: MenuItemType<MenuKeys>[] = [
  {
    page: MenuKeys.Home,
    path: AppRoute.Home,
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.History,
    path: AppRoute.History,
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.Profile,
    path: AppRoute.Profile,
    icon: <FontAwesomeIcon icon={faUser} />,
  },
];
