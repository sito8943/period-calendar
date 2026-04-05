import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { deleteDailyLog as deleteDailyLogFromStorage } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useDeleteDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDailyLogFromStorage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}
