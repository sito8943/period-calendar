import { useMemo } from "react";

// lib
import {
  calculateCycleLengthStdDev,
  calculateAverageCycleLength,
  calculateAveragePeriodDuration,
  getLatestCycleVariation,
  hasReportedPeriodInMonth,
  isDateInFertileWindow,
  predictNextPeriodStart,
  type Period,
  type Settings,
} from "lib";

export function useCycleStats(periods: Period[], settings: Settings) {
  return useMemo(() => {
    const avgCycleLength = calculateAverageCycleLength(periods);
    const avgPeriodDuration = calculateAveragePeriodDuration(periods);
    const cycleLengthStdDev = calculateCycleLengthStdDev(periods);
    const latestCycleVariation = getLatestCycleVariation(periods);
    const nextPeriodStart = predictNextPeriodStart(
      periods,
      settings.defaultCycleLength,
    );

    let daysUntilNext: number | null = null;
    if (nextPeriodStart) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      daysUntilNext = Math.round(
        (nextPeriodStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isInFertileWindowToday = isDateInFertileWindow(
      periods,
      settings.defaultCycleLength,
      today,
    );
    const hasReportedPeriodThisMonth = hasReportedPeriodInMonth(
      periods,
      today.getFullYear(),
      today.getMonth(),
    );

    return {
      avgCycleLength,
      avgPeriodDuration,
      cycleLengthStdDev,
      latestCycleVariation,
      nextPeriodStart,
      daysUntilNext,
      isInFertileWindowToday,
      hasReportedPeriodThisMonth,
    };
  }, [periods, settings.defaultCycleLength]);
}
