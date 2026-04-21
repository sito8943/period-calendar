import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type Period } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function usePeriodsList() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  useEffect(() => {
    let isActive = true;

    const preloadPeriodsFromMirror = async () => {
      const cachedPeriods = await periodCalendarManager.Periods.getMirrorSnapshot();
      if (!isActive || cachedPeriods.length === 0) return;

      queryClient.setQueryData<Period[] | undefined>(
        PeriodQueryKeys.list(queryScope).queryKey,
        (currentPeriods) => {
          if (Array.isArray(currentPeriods) && currentPeriods.length > 0) {
            return currentPeriods;
          }
          return cachedPeriods;
        },
      );
    };

    void preloadPeriodsFromMirror();

    return () => {
      isActive = false;
    };
  }, [queryClient, queryScope]);

  return useQuery({
    ...PeriodQueryKeys.list(queryScope),
    queryFn: async () => periodCalendarManager.Periods.get(),
  });
}
