import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import { addPeriod, type AddPeriodDto } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useAddPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AddPeriodDto) => addPeriod(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.all());
    },
  });
}
