import type { TFunction } from "i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";

// lib
import {
  toBaseAppLanguage,
  type PeriodTheme,
  type ProfileLanguage,
} from "lib";

// constants
import {
  PROFILE_NAME_MAX_LENGTH,
  PROFILE_PARTNER_NAME_MAX_LENGTH,
} from "./constants";

export const normalizeProfileLanguage = (
  value?: string | null,
): ProfileLanguage => toBaseAppLanguage(value);

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string") return maybeError.message;
  }
  return fallback;
};

export const getLanguageOptions = (t: TFunction): Option[] => [
  {
    id: "en",
    name: t("_pages:profile.values.languageEnglish"),
  },
  {
    id: "es",
    name: t("_pages:profile.values.languageSpanish"),
  },
];

export const getThemeOptions = (t: TFunction): Option[] => [
  {
    id: "girl",
    name: t("_pages:profile.values.themeGirl"),
  },
  {
    id: "boy",
    name: t("_pages:profile.values.themeBoy"),
  },
];

export const getPartnerNameLabel = (
  theme: PeriodTheme,
  t: TFunction,
): string =>
  theme === "boy"
    ? t("_pages:profile.labels.partnerNameGirl")
    : t("_pages:profile.labels.partnerNameBoy");

export function validateProfileName(value: string, t: TFunction): true | string {
  const parsedValue = value.trim();
  if (!parsedValue.length) {
    return t("_pages:profile.errors.nameRequired");
  }
  if (parsedValue.length > PROFILE_NAME_MAX_LENGTH) {
    return t("_pages:profile.errors.nameMax");
  }
  return true;
}

export function validatePartnerName(value: string, t: TFunction): true | string {
  const parsedValue = value.trim();

  if (!parsedValue.length) {
    return true;
  }

  if (parsedValue.length > PROFILE_PARTNER_NAME_MAX_LENGTH) {
    return t("_pages:profile.errors.partnerNameMax");
  }

  return true;
}

export const mapThemeValue = (value: string): PeriodTheme =>
  value as PeriodTheme;
