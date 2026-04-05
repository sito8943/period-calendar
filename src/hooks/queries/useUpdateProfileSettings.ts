import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import {
  saveProfileSettings,
  type ProfileSettings,
} from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: Omit<ProfileSettings, "updatedAt">) => {
      const nextProfile: ProfileSettings = {
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      saveProfileSettings(nextProfile);
      return Promise.resolve(nextProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(PeriodQueryKeys.profile());
    },
  });
}
