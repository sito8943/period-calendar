import type { Period } from "./types";
import { diffInDays, parseLocalDate } from "./dates";

export type CycleTrend = "longer" | "shorter" | "stable";

export interface CycleVariation {
  latestCycleLength: number;
  previousCycleLength: number | null;
  baselineCycleLength: number | null;
  deltaVsPrevious: number | null;
  deltaVsBaseline: number | null;
  trend: CycleTrend;
}

export function getPeriodDurationDays(period: Period): number | null {
  if (!period.endDate) return null;
  return diffInDays(period.startDate, period.endDate) + 1;
}

export function getCycleLengths(periods: Period[]): number[] {
  if (periods.length < 2) return [];
  const sorted = [...periods].sort(
    (a, b) =>
      parseLocalDate(a.startDate).getTime() -
      parseLocalDate(b.startDate).getTime(),
  );

  const cycleLengths: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const days = diffInDays(sorted[i - 1].startDate, sorted[i].startDate);
    if (days > 0) {
      cycleLengths.push(days);
    }
  }

  return cycleLengths;
}

export function calculateAverageCycleLength(periods: Period[]): number | null {
  const cycleLengths = getCycleLengths(periods);
  if (cycleLengths.length === 0) return null;

  const totalDays = cycleLengths.reduce((sum, value) => sum + value, 0);
  return Math.round(totalDays / cycleLengths.length);
}

export function calculateCycleLengthStdDev(periods: Period[]): number | null {
  const cycleLengths = getCycleLengths(periods);
  if (cycleLengths.length < 2) return null;

  const mean = cycleLengths.reduce((sum, value) => sum + value, 0) / cycleLengths.length;
  const variance =
    cycleLengths.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    cycleLengths.length;

  return Math.round(Math.sqrt(variance) * 10) / 10;
}

export function getLatestCycleVariation(periods: Period[]): CycleVariation | null {
  const cycleLengths = getCycleLengths(periods);
  if (cycleLengths.length === 0) return null;

  const latestCycleLength = cycleLengths[cycleLengths.length - 1];
  const previousCycleLength =
    cycleLengths.length >= 2 ? cycleLengths[cycleLengths.length - 2] : null;
  const baselineCycles = cycleLengths.slice(0, -1);
  const baselineCycleLength =
    baselineCycles.length > 0
      ? Math.round(
          baselineCycles.reduce((sum, value) => sum + value, 0) /
            baselineCycles.length,
        )
      : null;

  const deltaVsPrevious =
    previousCycleLength !== null
      ? latestCycleLength - previousCycleLength
      : null;
  const deltaVsBaseline =
    baselineCycleLength !== null
      ? latestCycleLength - baselineCycleLength
      : null;

  let trend: CycleTrend = "stable";
  const referenceDelta = deltaVsPrevious ?? deltaVsBaseline;
  if (referenceDelta !== null) {
    if (referenceDelta > 0) trend = "longer";
    else if (referenceDelta < 0) trend = "shorter";
  }

  return {
    latestCycleLength,
    previousCycleLength,
    baselineCycleLength,
    deltaVsPrevious,
    deltaVsBaseline,
    trend,
  };
}

export function calculateAveragePeriodDuration(
  periods: Period[],
): number | null {
  const completePeriods = periods.filter((p) => p.endDate !== null);
  if (completePeriods.length === 0) return null;

  const totalDays = completePeriods.reduce((sum, p) => {
    const duration = getPeriodDurationDays(p);
    return sum + (duration ?? 0);
  }, 0);

  return Math.round(totalDays / completePeriods.length);
}

export function predictNextPeriodStart(
  periods: Period[],
  defaultCycleLength: number,
): Date | null {
  if (periods.length === 0) return null;

  const sorted = [...periods].sort(
    (a, b) =>
      parseLocalDate(b.startDate).getTime() -
      parseLocalDate(a.startDate).getTime(),
  );

  const lastStart = parseLocalDate(sorted[0].startDate);
  const avgCycle = calculateAverageCycleLength(periods) ?? defaultCycleLength;

  const nextDate = new Date(lastStart);
  nextDate.setDate(nextDate.getDate() + avgCycle);

  return nextDate;
}

export function isDateInPeriod(date: Date, period: Period): boolean {
  const start = parseLocalDate(period.startDate);
  const end = period.endDate
    ? parseLocalDate(period.endDate)
    : new Date(start.getTime() + 4 * 24 * 60 * 60 * 1000); // default 5 days if no end

  return date >= start && date <= end;
}

export function getPredictedPeriodDays(
  periods: Period[],
  defaultCycleLength: number,
  defaultPeriodLength: number,
): { start: Date; end: Date } | null {
  const nextStart = predictNextPeriodStart(periods, defaultCycleLength);
  if (!nextStart) return null;

  const avgDuration =
    calculateAveragePeriodDuration(periods) ?? defaultPeriodLength;
  const end = new Date(nextStart);
  end.setDate(end.getDate() + avgDuration - 1);

  return { start: nextStart, end };
}

function getEffectivePeriodEnd(period: Period): Date {
  const start = parseLocalDate(period.startDate);
  if (period.endDate) return parseLocalDate(period.endDate);

  const fallbackEnd = new Date(start);
  fallbackEnd.setDate(fallbackEnd.getDate() + 4);
  return fallbackEnd;
}

function rangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA <= endB && endA >= startB;
}

export function getPredictedPeriodDaysForMonth(
  periods: Period[],
  defaultCycleLength: number,
  defaultPeriodLength: number,
  year: number,
  month: number,
): { start: Date; end: Date } | null {
  if (periods.length === 0) return null;

  const avgCycle = calculateAverageCycleLength(periods) ?? defaultCycleLength;
  const avgDuration =
    calculateAveragePeriodDuration(periods) ?? defaultPeriodLength;

  if (avgCycle <= 0 || avgDuration <= 0) return null;

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  const hasReportedPeriodInMonth = periods.some((period) => {
    const periodStart = parseLocalDate(period.startDate);
    const periodEnd = getEffectivePeriodEnd(period);
    return rangesOverlap(periodStart, periodEnd, monthStart, monthEnd);
  });

  if (hasReportedPeriodInMonth) return null;

  const firstPredictedStart = predictNextPeriodStart(periods, defaultCycleLength);
  if (!firstPredictedStart) return null;

  const predictedStart = new Date(firstPredictedStart);
  if (predictedStart < monthStart) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const daysUntilMonth = Math.floor(
      (monthStart.getTime() - predictedStart.getTime()) / MS_PER_DAY,
    );
    const cyclesToSkip = Math.max(0, Math.floor(daysUntilMonth / avgCycle) - 1);
    predictedStart.setDate(predictedStart.getDate() + cyclesToSkip * avgCycle);
  }

  let safetyCounter = 0;
  while (predictedStart <= monthEnd && safetyCounter < 400) {
    const predictedEnd = new Date(predictedStart);
    predictedEnd.setDate(predictedEnd.getDate() + avgDuration - 1);

    if (rangesOverlap(predictedStart, predictedEnd, monthStart, monthEnd)) {
      return {
        start: new Date(predictedStart),
        end: predictedEnd,
      };
    }

    predictedStart.setDate(predictedStart.getDate() + avgCycle);
    safetyCounter++;
  }

  return null;
}
