import { useQuery } from "@tanstack/react-query";

// lib
import { getDailyLogs } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useDailyLogsList() {
  return useQuery({
    ...PeriodQueryKeys.dailyLogsList(),
    queryFn: async () => getDailyLogs(),
  });
}
