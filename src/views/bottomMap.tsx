import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { AppRoute } from "lib";
import type { BottomNavItemType } from "../components/BottomNavigation/types";

export const bottomMap: BottomNavItemType[] = [
  {
    page: "home",
    path: AppRoute.Home,
    icon: <FontAwesomeIcon icon={faHome} />,
    position: "left",
  },
  {
    page: "history",
    path: AppRoute.History,
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    position: "right",
  },
];
