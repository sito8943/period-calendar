import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type AddPeriodDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useAddPeriod() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  return useMutation({
    mutationFn: async (dto: AddPeriodDto) => periodCalendarManager.Periods.insert(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all(queryScope));
    },
  });
}
