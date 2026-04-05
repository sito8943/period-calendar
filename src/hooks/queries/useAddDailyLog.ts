import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { addDailyLog, type AddDailyLogDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useAddDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AddDailyLogDto) => addDailyLog(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.dailyLogs());
    },
  });
}
