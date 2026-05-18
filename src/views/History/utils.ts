import type { Period } from "lib";

export const isHistoryEmpty = (periods: Period[]): boolean =>
  periods.length === 0;
