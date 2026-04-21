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
  Onboarding,
  toLocal,
  useOptionalAuthContext,
} from "@sito/dashboard-app";
import type { BaseLinkPropsType } from "@sito/dashboard-app";
import type { BottomNavigationItemType } from "@sito/dashboard-app";
import type { OnboardingStepType } from "@sito/dashboard-app";

import { PeriodQueryKeys, useProfileSettings } from "hooks";

// components
import Header from "./Header";
import Footer from "./Footer";
import { OnboardingPeriodForm } from "./OnboardingPeriodForm";

import { config } from "../../config";
import {
  AppRoute,
  getStoredPeriodTheme,
  getThemedLanguage,
  setPeriodTheme,
  toBaseAppLanguage,
} from "lib";
import { getFeatureFilteredBottomMap } from "../../views/bottomMap";
import { useFeatureFlags } from "providers";

export function View() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const auth = useOptionalAuthContext();
  const accountToken = auth?.account?.token ?? null;
  const previousAccountTokenRef = useRef<string | null>(accountToken);
  const { isFeatureEnabled } = useFeatureFlags();
  const { data: profileSettings } = useProfileSettings();
  const [showOnboarding, setShowOnboarding] = useState(
    () => !fromLocal(config.storage.onboarding),
  );
  const [selectedTheme, setSelectedTheme] = useState(getStoredPeriodTheme);

  useEffect(() => {
    if (!showOnboarding) return;
    toLocal(config.storage.onboarding, true);
  }, [showOnboarding]);

  useEffect(() => {
    const previousAccountToken = previousAccountTokenRef.current;
    if (previousAccountToken === accountToken) return;

    previousAccountTokenRef.current = accountToken;

    void queryClient.invalidateQueries(PeriodQueryKeys.list());
    void queryClient.invalidateQueries(PeriodQueryKeys.dailyLogsList());
    void queryClient.invalidateQueries(PeriodQueryKeys.profile());
  }, [accountToken, queryClient]);

  useEffect(() => {
    if (!profileSettings) return;

    const fallbackLanguage = toBaseAppLanguage(
      i18n.resolvedLanguage ?? i18n.language,
    );
    const profileLanguage = profileSettings.updatedAt
      ? toBaseAppLanguage(profileSettings.language)
      : fallbackLanguage;
    const profileTheme = profileSettings.theme ?? getStoredPeriodTheme();
    const themedLanguage = getThemedLanguage(profileLanguage, profileTheme);

    setSelectedTheme((currentTheme) =>
      currentTheme === profileTheme ? currentTheme : profileTheme,
    );

    if (getStoredPeriodTheme() !== profileTheme) {
      setPeriodTheme(profileTheme);
    }

    if (i18n.language !== themedLanguage) {
      void i18n.changeLanguage(themedLanguage);
    }
  }, [
    i18n,
    i18n.language,
    i18n.resolvedLanguage,
    profileSettings,
  ]);

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

  const handleThemeSelect = useCallback((theme: "girl" | "boy") => {
    setSelectedTheme(theme);
    setPeriodTheme(theme);
    const baseLanguage = toBaseAppLanguage(i18n.resolvedLanguage ?? i18n.language);
    void i18n.changeLanguage(getThemedLanguage(baseLanguage, theme));
  }, [i18n]);

  const closeOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const onboardingSteps = useMemo<OnboardingStepType[]>(
    () => [
      {
        title: t("_pages:onboarding.profile.title"),
        body: t("_pages:onboarding.profile.body"),
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full onboarding-theme-grid">
            <button
              type="button"
              onClick={() => handleThemeSelect("girl")}
              className={`onboarding-theme-option border border-border rounded-lg px-3 py-2 text-left transition-colors ${selectedTheme === "girl" ? "bg-primary text-white border-primary" : "bg-base-light text-text hover:bg-base-dark"}`}
            >
              <strong>{t("_pages:onboarding.profile.options.girl.title")}</strong>
              <p className="text-sm opacity-90">
                {t("_pages:onboarding.profile.options.girl.body")}
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeSelect("boy")}
              className={`onboarding-theme-option border border-border rounded-lg px-3 py-2 text-left transition-colors ${selectedTheme === "boy" ? "bg-primary text-white border-primary" : "bg-base-light text-text hover:bg-base-dark"}`}
            >
              <strong>{t("_pages:onboarding.profile.options.boy.title")}</strong>
              <p className="text-sm opacity-90">
                {t("_pages:onboarding.profile.options.boy.body")}
              </p>
            </button>
          </div>
        ),
      },
      {
        title: t("_pages:onboarding.calendar.title"),
        body: t("_pages:onboarding.calendar.body"),
        content: <OnboardingPeriodForm />,
      },
      {
        title: t("_pages:onboarding.predictions.title"),
        body: t("_pages:onboarding.predictions.body"),
      },
      {
        title: t("_pages:onboarding.privacy.title"),
        body: t("_pages:onboarding.privacy.body"),
      },
      {
        title: t("_pages:onboarding.getStarted.title"),
        body: t("_pages:onboarding.getStarted.body"),
      },
    ],
    [handleThemeSelect, selectedTheme, t],
  );

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
  ) => (item.to === AppRoute.Home ? pathname === AppRoute.Home : pathname.startsWith(item.to));

  const centerAction = useMemo(() => {
    if (!isFeatureEnabled("periodLogEnabled")) return undefined;

    return {
      to: AppRoute.PeriodLog,
      ariaLabel: t("_pages:home.logPeriod"),
    };
  }, [isFeatureEnabled, t]);

  return (
    <ConfigProvider
      navigate={(route) => navigate(route as To)}
      location={location}
      linkComponent={Link as unknown as ComponentType<BaseLinkPropsType>}
    >
      <NavbarProvider>
        <BottomNavActionProvider>
          {showOnboarding && (
            <Onboarding
              steps={onboardingSteps}
              onSkip={closeOnboarding}
              onSignIn={() => navigate(AppRoute.SignIn)}
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
