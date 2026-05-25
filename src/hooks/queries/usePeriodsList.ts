import { useQuery } from "@tanstack/react-query";

// lib
import { periodCalendarManager } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function usePeriodsList() {
  const queryScope = usePeriodQueryScope();

  return useQuery({
    ...PeriodQueryKeys.list(queryScope),
    queryFn: () => periodCalendarManager.Periods.get(),
  });
}
