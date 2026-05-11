import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import type { To } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ComponentType } from "react";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  BottomNavActionProvider,
  BottomNavigation,
  ConfigProvider,
  fromLocal,
  NavbarProvider,
  Notification,
  toLocal,
  useOptionalAuthContext,
} from "@sito/dashboard-app";
import type {
  BottomNavigationItemType,
  BaseLinkPropsType,
} from "@sito/dashboard-app";

// hooks
import { PeriodQueryKeys, useProfileSettings } from "hooks";
import { resolvePeriodQueryScopeFromAccount } from "../../hooks/queries";

// components
import Header from "./Header";
import Footer from "./Footer";
import { PeriodOnboarding } from "components";

// config
import { config } from "../../config";

// lib
import {
  AppRoutes,
  getAppliedPeriodTheme,
  getStoredPeriodTheme,
  getThemedLanguage,
  setPeriodTheme,
  toBaseAppLanguage,
} from "lib";

// menu
import { getFeatureFilteredBottomMap } from "../../views/bottomMap";

// providers
import { useFeatureFlags } from "providers";

export function View() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const auth = useOptionalAuthContext();
  const accountQueryScope = resolvePeriodQueryScopeFromAccount(
    auth?.account ?? null,
  );
  const previousQueryScopeRef = useRef(accountQueryScope);
  const { isFeatureEnabled } = useFeatureFlags();
  const { data: profileSettings } = useProfileSettings();
  const [showOnboarding, setShowOnboarding] = useState(
    () => !fromLocal(config.storage.onboarding),
  );

  useEffect(() => {
    if (!showOnboarding) return;
    toLocal(config.storage.onboarding, true);
  }, [showOnboarding]);

  useEffect(() => {
    const previousQueryScope = previousQueryScopeRef.current;
    if (previousQueryScope === accountQueryScope) return;

    previousQueryScopeRef.current = accountQueryScope;

    void queryClient.invalidateQueries(
      PeriodQueryKeys.list(previousQueryScope),
    );
    void queryClient.invalidateQueries(
      PeriodQueryKeys.dailyLogsList(previousQueryScope),
    );
    void queryClient.invalidateQueries(
      PeriodQueryKeys.profile(previousQueryScope),
    );

    void queryClient.invalidateQueries(PeriodQueryKeys.list(accountQueryScope));
    void queryClient.invalidateQueries(
      PeriodQueryKeys.dailyLogsList(accountQueryScope),
    );
    void queryClient.invalidateQueries(
      PeriodQueryKeys.profile(accountQueryScope),
    );
  }, [accountQueryScope, queryClient]);

  useEffect(() => {
    if (!profileSettings) return;

    const fallbackLanguage = toBaseAppLanguage(
      i18n.resolvedLanguage ?? i18n.language,
    );
    const hasPersistedProfileSettings = Boolean(profileSettings.updatedAt);
    const profileLanguage = hasPersistedProfileSettings
      ? toBaseAppLanguage(profileSettings.language)
      : fallbackLanguage;
    const profileTheme = hasPersistedProfileSettings
      ? profileSettings.theme
      : getStoredPeriodTheme();
    const themedLanguage = getThemedLanguage(profileLanguage, profileTheme);

    if (getAppliedPeriodTheme() !== profileTheme) {
      setPeriodTheme(profileTheme);
    }

    if (i18n.language !== themedLanguage) {
      void i18n.changeLanguage(themedLanguage);
    }
  }, [i18n, i18n.language, i18n.resolvedLanguage, profileSettings]);

  useEffect(() => {
    const theme = getStoredPeriodTheme();
    const baseLanguage = toBaseAppLanguage(
      i18n.resolvedLanguage ?? i18n.language,
    );
    const themedLanguage = getThemedLanguage(baseLanguage, theme);

    if (i18n.language !== themedLanguage) {
      void i18n.changeLanguage(themedLanguage);
    }
  }, [i18n, i18n.language, i18n.resolvedLanguage]);

  const closeOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const bottomNavigationItems = useMemo<BottomNavigationItemType[]>(
    () =>
      getFeatureFilteredBottomMap(isFeatureEnabled).map((item) => {
        const label = t(`_pages:${item.page}.title`);

        return {
          id: item.id,
          to: item.to,
          icon: item.icon,
          position: item.position,
          label,
          ariaLabel: label,
        };
      }),
    [isFeatureEnabled, t],
  );

  const isBottomNavItemActive = (
    pathname: string,
    item: BottomNavigationItemType,
  ) =>
    item.to === AppRoutes.Home
      ? pathname === AppRoutes.Home
      : pathname.startsWith(item.to);

  const centerAction = useMemo(() => {
    if (!isFeatureEnabled("periodLogEnabled")) return undefined;

    return {
      to: AppRoutes.PeriodLog,
      ariaLabel: t("_pages:home.logPeriod"),
    };
  }, [isFeatureEnabled, t]);

  return (
    <ConfigProvider
      navigate={(route) => navigate(route as To)}
      location={location}
      linkComponent={Link as ComponentType<BaseLinkPropsType>}
    >
      <NavbarProvider>
        <BottomNavActionProvider>
          {showOnboarding && (
            <PeriodOnboarding
              onSkip={closeOnboarding}
              onSignIn={() => navigate(AppRoutes.SignIn)}
              onStartAsGuest={closeOnboarding}
            />
          )}
          <Header />
          <Outlet />
          <Footer />
          <BottomNavigation
            items={bottomNavigationItems}
            centerAction={centerAction}
            isItemActive={isBottomNavItemActive}
          />
          <Tooltip id="tooltip" />
          <Notification />
        </BottomNavActionProvider>
      </NavbarProvider>
    </ConfigProvider>
  );
}
