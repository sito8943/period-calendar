import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import type { To } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ComponentType } from "react";

// @sito/dashboard-app
import {
  ConfigProvider,
  fromLocal,
  NavbarProvider,
  Notification,
  Onboarding,
  toLocal,
} from "@sito/dashboard-app";
import type { BaseLinkPropsType } from "@sito/dashboard-app";
import type { OnboardingStepType } from "@sito/dashboard-app";

// components
import { BottomNavigation } from "components";
import Header from "./Header";
import Footer from "./Footer";

// providers
import { BottomNavActionProvider } from "providers";
import { config } from "../../config";
import {
  getStoredPeriodTheme,
  getThemedLanguage,
  setPeriodTheme,
  toBaseAppLanguage,
} from "lib";

export function View() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(
    () => !fromLocal(config.storage.onboarding),
  );
  const [selectedTheme, setSelectedTheme] = useState(getStoredPeriodTheme);

  useEffect(() => {
    if (!showOnboarding) return;
    toLocal(config.storage.onboarding, true);
  }, [showOnboarding]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => handleThemeSelect("girl")}
              className={`border border-border rounded-lg px-3 py-2 text-left transition-colors ${selectedTheme === "girl" ? "bg-primary text-white border-primary" : "bg-base-light text-text hover:bg-base-dark"}`}
            >
              <strong>{t("_pages:onboarding.profile.options.girl.title")}</strong>
              <p className="text-sm opacity-90">
                {t("_pages:onboarding.profile.options.girl.body")}
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeSelect("boy")}
              className={`border border-border rounded-lg px-3 py-2 text-left transition-colors ${selectedTheme === "boy" ? "bg-primary text-white border-primary" : "bg-base-light text-text hover:bg-base-dark"}`}
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
              onSignIn={closeOnboarding}
              onStartAsGuest={closeOnboarding}
            />
          )}
          <Header />
          <Outlet />
          <Footer />
          <BottomNavigation />
          <Tooltip id="tooltip" />
          <Notification />
        </BottomNavActionProvider>
      </NavbarProvider>
    </ConfigProvider>
  );
}
