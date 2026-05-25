import { useQuery } from "@tanstack/react-query";

// lib
import { periodCalendarManager } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useProfileSettings() {
  const queryScope = usePeriodQueryScope();

  return useQuery({
    ...PeriodQueryKeys.profile(queryScope),
    queryFn: () => periodCalendarManager.Profiles.get(),
    refetchOnMount: "always",
  });
}
