import type { HistoryPeriod } from "./types";

export const isHistoryEmpty = (periods: HistoryPeriod[]): boolean =>
  periods.length === 0;
