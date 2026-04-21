import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type AddPeriodDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useAddPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AddPeriodDto) => periodCalendarManager.Periods.insert(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}
