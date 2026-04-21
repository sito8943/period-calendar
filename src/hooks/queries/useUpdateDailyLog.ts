import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type UpdateDailyLogDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useUpdateDailyLog() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  return useMutation({
    mutationFn: async (dto: UpdateDailyLogDto) =>
      periodCalendarManager.DailyLogs.update(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs(queryScope));
    },
  });
}
