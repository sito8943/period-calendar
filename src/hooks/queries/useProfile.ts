import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// lib
import {
  getProfileSettings,
  saveProfileSettings,
  type ProfileSettings,
} from "lib";
import { PeriodQueryKeys } from "./utils";

export function useProfileSettings() {
  return useQuery({
    ...PeriodQueryKeys.profile(),
    queryFn: () => getProfileSettings(),
  });
}

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
