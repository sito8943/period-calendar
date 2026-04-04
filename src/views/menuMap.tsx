/* eslint-disable react-refresh/only-export-components */
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClockRotateLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
    path: "/",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.History,
    path: "/history",
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.Profile,
    path: "/profile",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
];
