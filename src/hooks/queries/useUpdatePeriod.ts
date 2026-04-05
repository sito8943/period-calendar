import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { updatePeriod, type UpdatePeriodDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useUpdatePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdatePeriodDto) => updatePeriod(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}
