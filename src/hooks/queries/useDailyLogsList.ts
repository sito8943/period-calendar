import { useQuery } from "@tanstack/react-query";

// lib
import { periodCalendarManager } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useDailyLogsList() {
  const queryScope = usePeriodQueryScope();

  return useQuery({
    ...PeriodQueryKeys.dailyLogsList(queryScope),
    queryFn: () => periodCalendarManager.DailyLogs.get(),
  });
}
