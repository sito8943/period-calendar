import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type AddDailyLogDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useAddDailyLog() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  return useMutation({
    mutationFn: async (dto: AddDailyLogDto) =>
      periodCalendarManager.DailyLogs.insert(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs(queryScope));
    },
  });
}
