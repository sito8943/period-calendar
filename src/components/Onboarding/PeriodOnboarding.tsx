import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";

// @sito/dashboard-app
import { Onboarding, type OnboardingStepType } from "@sito/dashboard-app";

// components
import { OnboardingPeriodForm } from "./OnboardingPeriodForm";

// types
import type { PeriodOnboardingPropsType } from "./types";

// lib
import {
  getAppliedPeriodTheme,
  getStoredPeriodTheme,
  getThemedLanguage,
  setPeriodTheme,
  toBaseAppLanguage,
} from "lib";

// hooks
import { useProfileSettings, useUpdateProfileSettings } from "hooks";

export const PeriodOnboarding = (props: PeriodOnboardingPropsType) => {
  const { t, i18n } = useTranslation();

  const [selectedTheme, setSelectedTheme] = useState(getStoredPeriodTheme);
  const { data: profileSettings } = useProfileSettings();
  const updateProfileSettings = useUpdateProfileSettings();

  useEffect(() => {
    const profileTheme = profileSettings?.updatedAt
      ? profileSettings.theme
      : getStoredPeriodTheme();

    if (getAppliedPeriodTheme() !== profileTheme) {
      setPeriodTheme(profileTheme);
    }
    setSelectedTheme((currentTheme) =>
      currentTheme === profileTheme ? currentTheme : profileTheme,
    );
  }, [profileSettings?.theme, profileSettings?.updatedAt]);

  const handleThemeSelect = useCallback(
    (theme: "girl" | "boy") => {
      setPeriodTheme(theme);
      setSelectedTheme(theme);

      const baseLanguage = toBaseAppLanguage(
        i18n.resolvedLanguage ?? i18n.language,
      );

      const profileLanguage = profileSettings?.updatedAt
        ? toBaseAppLanguage(profileSettings.language)
        : baseLanguage;

      updateProfileSettings.mutate({
        name: profileSettings?.name ?? "",
        partnerName: profileSettings?.partnerName ?? "",
        language: profileLanguage,
        theme,
      });

      void i18n.changeLanguage(getThemedLanguage(baseLanguage, theme));
    },
    [i18n, profileSettings, updateProfileSettings],
  );

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
              <strong>
                {t("_pages:onboarding.profile.options.girl.title")}
              </strong>
              <p className="text-sm opacity-90">
                {t("_pages:onboarding.profile.options.girl.body")}
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeSelect("boy")}
              className={`onboarding-theme-option border border-border rounded-lg px-3 py-2 text-left transition-colors ${selectedTheme === "boy" ? "bg-primary text-white border-primary" : "bg-base-light text-text hover:bg-base-dark"}`}
            >
              <strong>
                {t("_pages:onboarding.profile.options.boy.title")}
              </strong>
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

  return <Onboarding {...props} steps={onboardingSteps} />;
};
