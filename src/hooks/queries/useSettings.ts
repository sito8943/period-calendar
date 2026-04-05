import { useQuery } from "@tanstack/react-query";

// lib
import { getSettings } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useSettings() {
  return useQuery({
    ...PeriodQueryKeys.settings(),
    queryFn: () => getSettings(),
  });
}
