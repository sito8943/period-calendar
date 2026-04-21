import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type DailyLog } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useDailyLogsList() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isActive = true;

    const preloadDailyLogsFromMirror = async () => {
      const cachedDailyLogs = await periodCalendarManager.DailyLogs.getMirrorSnapshot();
      if (!isActive || cachedDailyLogs.length === 0) return;

      queryClient.setQueryData<DailyLog[] | undefined>(
        PeriodQueryKeys.dailyLogsList().queryKey,
        (currentDailyLogs) => {
          if (Array.isArray(currentDailyLogs) && currentDailyLogs.length > 0) {
            return currentDailyLogs;
          }
          return cachedDailyLogs;
        },
      );
    };

    void preloadDailyLogsFromMirror();

    return () => {
      isActive = false;
    };
  }, [queryClient]);

  return useQuery({
    ...PeriodQueryKeys.dailyLogsList(),
    queryFn: async () => periodCalendarManager.DailyLogs.get(),
  });
}
