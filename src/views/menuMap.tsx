/* eslint-disable react-refresh/only-export-components */
// @sito/dashboard-app
import {
  filterMenuByFeatureFlags,
  normalizeMenuDividers,
  type MenuItemType,
  type FeatureEnabledFn,
} from "@sito/dashboard-app";

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

// lib
import { AppRoutes } from "lib";
import type { FeatureFlagKey } from "lib";

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

const getMenuMap = (): MenuItemType<MenuKeys>[] => [
  {
    page: MenuKeys.Home,
    path: AppRoutes.Home,
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    page: MenuKeys.History,
    path: AppRoutes.History,
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.About,
    path: AppRoutes.About,
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
  },
  {
    page: MenuKeys.TermsAndConditions,
    path: AppRoutes.TermsAndConditions,
    icon: <FontAwesomeIcon icon={faScroll} />,
  },
  {
    page: MenuKeys.CookiesPolicy,
    path: AppRoutes.CookiesPolicy,
    icon: <FontAwesomeIcon icon={faCookieBite} />,
  },
  {
    page: MenuKeys.PrivacyPolicy,
    path: AppRoutes.PrivacyPolicy,
    icon: <FontAwesomeIcon icon={faShieldHalved} />,
  },
  { type: "divider" },
  {
    page: MenuKeys.Profile,
    path: AppRoutes.Profile,
    icon: <FontAwesomeIcon icon={faUser} />,
    auth: true,
  },
  { type: "divider" },
  {
    page: MenuKeys.SignOut,
    path: AppRoutes.SignOut,
    icon: <FontAwesomeIcon icon={faRightFromBracket} />,
    auth: true,
  },
  {
    page: MenuKeys.SignIn,
    path: AppRoutes.SignIn,
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
  isFeatureEnabled: FeatureEnabledFn<FeatureFlagKey>,
  language?: string,
): MenuItemType<MenuKeys>[] => {
  void language;

  const filtered = filterMenuByFeatureFlags(
    getMenuMap(),
    isFeatureEnabled,
    menuFeatureDependencies,
  );

  return normalizeMenuDividers(filtered);
};
