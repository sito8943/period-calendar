import { useQuery } from "@tanstack/react-query";

// lib
import { periodCalendarManager } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useSettings() {
  return useQuery({
    ...PeriodQueryKeys.settings(),
    queryFn: () => periodCalendarManager.Settings.get(),
  });
}
