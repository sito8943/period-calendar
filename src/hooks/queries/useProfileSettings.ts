import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// lib
import {
  getProfileSettings,
  getProfileSettingsMirrorSnapshot,
  type ProfileSettings,
} from "lib";

// constants
import { PeriodQueryKeys } from "./constants";

export function useProfileSettings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isActive = true;

    const preloadProfileFromMirror = async () => {
      const cachedProfile = await getProfileSettingsMirrorSnapshot();
      if (!isActive) return;

      queryClient.setQueryData<ProfileSettings | undefined>(
        PeriodQueryKeys.profile().queryKey,
        (currentProfile) => currentProfile ?? cachedProfile,
      );
    };

    void preloadProfileFromMirror();

    return () => {
      isActive = false;
    };
  }, [queryClient]);

  return useQuery({
    ...PeriodQueryKeys.profile(),
    queryFn: async () => getProfileSettings(),
  });
}
