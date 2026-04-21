import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import {
  periodCalendarManager,
  type ProfileSettings,
} from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  return useMutation({
    mutationFn: async (profile: Omit<ProfileSettings, "updatedAt">) => {
      const nextProfile: ProfileSettings = {
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      return periodCalendarManager.Profiles.save(nextProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.profile(queryScope));
    },
  });
}
