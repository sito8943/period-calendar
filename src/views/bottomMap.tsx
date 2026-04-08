import { faHome, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { AppRoute } from "lib";
import { PageId } from "./sitemap";
import type { BottomNavItemType } from "./types";

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
