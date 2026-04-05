import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { deletePeriod as deletePeriodFromStorage } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useDeletePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deletePeriodFromStorage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}
