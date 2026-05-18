import { useManager as useBaseManager } from "@sito/dashboard-app";

import type { PeriodCalendarManager } from "../lib/api";

export function useManager(): PeriodCalendarManager {
  return useBaseManager() as PeriodCalendarManager;
}
