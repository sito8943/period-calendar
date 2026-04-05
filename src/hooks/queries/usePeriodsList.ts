import { useQuery } from "@tanstack/react-query";

// lib
import { getPeriods } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function usePeriodsList() {
  return useQuery({
    ...PeriodQueryKeys.list(),
    queryFn: async () => getPeriods(),
  });
}
