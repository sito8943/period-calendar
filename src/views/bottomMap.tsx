import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import type { BottomNavItemType } from "../components/BottomNavigation/types";

export const bottomMap: BottomNavItemType[] = [
  {
    page: "home",
    path: "/",
    icon: <FontAwesomeIcon icon={faHome} />,
    position: "left",
  },
  {
    page: "history",
    path: "/history",
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    position: "right",
  },
];
