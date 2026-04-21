import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type DailyLog } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useDailyLogsList() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  useEffect(() => {
    let isActive = true;

    const preloadDailyLogsFromMirror = async () => {
      const cachedDailyLogs = await periodCalendarManager.DailyLogs.getMirrorSnapshot();
      if (!isActive || cachedDailyLogs.length === 0) return;

      queryClient.setQueryData<DailyLog[] | undefined>(
        PeriodQueryKeys.dailyLogsList(queryScope).queryKey,
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
  }, [queryClient, queryScope]);

  return useQuery({
    ...PeriodQueryKeys.dailyLogsList(queryScope),
    queryFn: async () => periodCalendarManager.DailyLogs.get(),
  });
}
