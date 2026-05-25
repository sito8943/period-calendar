import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Onboarding } from "@sito/dashboard-app";
import type { OnboardingStepType } from "@sito/dashboard-app";

// components
import { OnboardingPeriodForm } from "./OnboardingPeriodForm";

// types
import type { PeriodOnboardingProps } from "./types";

// lib
import {
  classNames,
  getAppliedPeriodTheme,
  getStoredPeriodTheme,
  getThemedLanguage,
  setPeriodTheme,
  toBaseAppLanguage,
} from "lib";

// hooks
import { useProfileSettings, useUpdateProfileSettings } from "hooks";

export const PeriodOnboarding = (props: PeriodOnboardingProps) => {
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
          <div className="onboarding-theme-grid">
            <button
              type="button"
              onClick={() => handleThemeSelect("girl")}
              className={classNames(
                "onboarding-theme-option",
                selectedTheme === "girl"
                  ? "onboarding-theme-option-selected"
                  : "onboarding-theme-option-idle",
              )}
            >
              <strong>
                {t("_pages:onboarding.profile.options.girl.title")}
              </strong>
              <p className="onboarding-theme-description">
                {t("_pages:onboarding.profile.options.girl.body")}
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleThemeSelect("boy")}
              className={classNames(
                "onboarding-theme-option",
                selectedTheme === "boy"
                  ? "onboarding-theme-option-selected"
                  : "onboarding-theme-option-idle",
              )}
            >
              <strong>
                {t("_pages:onboarding.profile.options.boy.title")}
              </strong>
              <p className="onboarding-theme-description">
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

  return <Onboarding {...props} remountStepOnChange steps={onboardingSteps} />;
};
