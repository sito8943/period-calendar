import type { Period } from "./types";
import { diffInDays, parseLocalDate } from "./dates";

export function getPeriodDurationDays(period: Period): number | null {
  if (!period.endDate) return null;
  return diffInDays(period.startDate, period.endDate) + 1;
}

export function calculateAverageCycleLength(periods: Period[]): number | null {
  if (periods.length < 2) return null;

  const sorted = [...periods].sort(
    (a, b) =>
      parseLocalDate(a.startDate).getTime() -
      parseLocalDate(b.startDate).getTime(),
  );

  let totalDays = 0;
  let count = 0;

  for (let i = 1; i < sorted.length; i++) {
    const days = diffInDays(sorted[i - 1].startDate, sorted[i].startDate);
    if (days > 0) {
      totalDays += days;
      count++;
    }
  }

  return count > 0 ? Math.round(totalDays / count) : null;
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
