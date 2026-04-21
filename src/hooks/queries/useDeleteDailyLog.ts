import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useDeleteDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await periodCalendarManager.DailyLogs.softDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}
