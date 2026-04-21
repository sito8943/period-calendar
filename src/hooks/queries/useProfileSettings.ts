import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// lib
import { periodCalendarManager, type ProfileSettings } from "lib";

// constants
import { PeriodQueryKeys } from "./constants";
import { usePeriodQueryScope } from "./usePeriodQueryScope";

export function useProfileSettings() {
  const queryClient = useQueryClient();
  const queryScope = usePeriodQueryScope();

  useEffect(() => {
    let isActive = true;

    const preloadProfileFromMirror = async () => {
      const cachedProfile = await periodCalendarManager.Profiles.getMirrorSnapshot();
      if (!isActive) return;

      queryClient.setQueryData<ProfileSettings | undefined>(
        PeriodQueryKeys.profile(queryScope).queryKey,
        (currentProfile) => currentProfile ?? cachedProfile,
      );
    };

    void preloadProfileFromMirror();

    return () => {
      isActive = false;
    };
  }, [queryClient, queryScope]);

  return useQuery({
    ...PeriodQueryKeys.profile(queryScope),
    queryFn: async () => periodCalendarManager.Profiles.get(),
    refetchOnMount: "always",
  });
}
