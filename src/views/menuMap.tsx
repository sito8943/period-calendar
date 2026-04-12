/* eslint-disable react-refresh/only-export-components */
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClockRotateLeft,
  faUser,
  faRightToBracket,
  faRightFromBracket,
  faCircleInfo,
  faCookieBite,
  faScroll,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { AppRoute } from "lib";
import type { FeatureFlagKey } from "lib";

// types
import type { IsFeatureEnabled, MenuItemType } from "./types";

export const MenuKeys = {
  Home: "home",
  History: "history",
  PeriodLog: "period-log",
  Profile: "profile",
  About: "about",
  CookiesPolicy: "cookiesPolicy",
  TermsAndConditions: "termsAndConditions",
  PrivacyPolicy: "privacyPolicy",
  SignOut: "auth.signOut",
  SignIn: "auth.signIn",
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
    page: MenuKeys.About,
    path: AppRoute.About,
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
  },
  {
    page: MenuKeys.TermsAndConditions,
    path: AppRoute.TermsAndConditions,
    icon: <FontAwesomeIcon icon={faScroll} />,
  },
  {
    page: MenuKeys.CookiesPolicy,
    path: AppRoute.CookiesPolicy,
    icon: <FontAwesomeIcon icon={faCookieBite} />,
  },
  {
    page: MenuKeys.PrivacyPolicy,
    path: AppRoute.PrivacyPolicy,
    icon: <FontAwesomeIcon icon={faShieldHalved} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.Profile,
    path: AppRoute.Profile,
    icon: <FontAwesomeIcon icon={faUser} />,
    auth: true,
  },
  { type: "divider" },
  {
    page: MenuKeys.SignOut,
    path: AppRoute.SignOut,
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
    auth: true,
  },
  {
    page: MenuKeys.SignIn,
    path: AppRoute.SignIn,
    icon: <FontAwesomeIcon icon={faRightToBracket} />,
    auth: false,
  },
];

const menuFeatureDependencies: Partial<Record<MenuKeys, FeatureFlagKey>> = {
  [MenuKeys.History]: "historyEnabled",
  [MenuKeys.PeriodLog]: "periodLogEnabled",
  [MenuKeys.Profile]: "profileEnabled",
  [MenuKeys.About]: "aboutEnabled",
  [MenuKeys.TermsAndConditions]: "termsAndConditionsEnabled",
  [MenuKeys.CookiesPolicy]: "cookiesPolicyEnabled",
  [MenuKeys.PrivacyPolicy]: "privacyPolicyEnabled",
};

export const getFeatureFilteredMenuMap = (
  isFeatureEnabled: IsFeatureEnabled,
): MenuItemType<MenuKeys>[] => {
  const filtered = menuMap.filter((item) => {
    if (!item.page) return true;

    const dependency = menuFeatureDependencies[item.page];
    if (!dependency) return true;

    return isFeatureEnabled(dependency);
  });

  return filtered.filter((item, index, items) => {
    if (item.type !== "divider") return true;

    const previous = items[index - 1];
    const next = items[index + 1];

    if (!previous || !next) return false;

    return previous.type !== "divider" && next.type !== "divider";
  });
};
