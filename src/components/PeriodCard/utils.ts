import type { TFunction } from "i18next";

// lib
import { formatDate } from "lib";

/**
 *
 * @param startDate
 * @param language
 * @returns
 */
export const getPeriodStartLabel = (
  startDate: string,
  language: string,
): string => {
  return formatDate(startDate, language);
};

/**
 *
 * @param endDate
 * @param duration
 * @param language
 * @param t
 * @returns
 */
export const getEndedPeriodSubtitle = (
  endDate: string,
  duration: number | null,
  language: string,
  t: TFunction,
): string => {
  return `${t("_pages:history.ended")}: ${formatDate(endDate, language)} - ${t("_pages:history.duration", { days: duration ?? 0 })}`;
};
