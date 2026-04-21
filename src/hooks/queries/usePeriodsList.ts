import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type Period } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function usePeriodsList() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isActive = true;

    const preloadPeriodsFromMirror = async () => {
      const cachedPeriods = await periodCalendarManager.Periods.getMirrorSnapshot();
      if (!isActive || cachedPeriods.length === 0) return;

      queryClient.setQueryData<Period[] | undefined>(
        PeriodQueryKeys.list().queryKey,
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
  }, [queryClient]);

  return useQuery({
    ...PeriodQueryKeys.list(),
    queryFn: async () => periodCalendarManager.Periods.get(),
  });
}
