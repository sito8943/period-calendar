import { useMemo } from "react";

// hooks
import { useDailyLogsList } from "./useDailyLogsList";

export function useDailyLogByDate(date?: string) {
  const { data: dailyLogs = [] } = useDailyLogsList();

  return useMemo(() => {
    if (!date) return undefined;
    return dailyLogs.find((log) => log.date === date);
  }, [date, dailyLogs]);
}
