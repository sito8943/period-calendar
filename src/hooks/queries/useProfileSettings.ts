import { useQuery } from "@tanstack/react-query";

// lib
import { getProfileSettings } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useProfileSettings() {
  return useQuery({
    ...PeriodQueryKeys.profile(),
    queryFn: () => getProfileSettings(),
  });
}
