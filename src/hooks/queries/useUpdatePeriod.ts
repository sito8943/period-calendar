import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type UpdatePeriodDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useUpdatePeriod() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  return useMutation({
    mutationFn: async (dto: UpdatePeriodDto) =>
      periodCalendarManager.Periods.update(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all(queryScope));
    },
  });
}
