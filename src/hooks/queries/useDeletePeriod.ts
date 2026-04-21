import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useDeletePeriod() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  return useMutation({
    mutationFn: async (id: string) => {
      await periodCalendarManager.Periods.softDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all(queryScope));
    },
  });
}
