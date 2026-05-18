import { useTranslation } from "react-i18next";
import { QueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  ManagerProvider,
  NotificationProvider,
  TranslationProvider,
} from "@sito/dashboard-app";

import type { BasicProviderPropTypes } from "./types";
import { periodCalendarManager } from "../lib/api";
import { FeatureFlagsProvider } from "./FeatureFlags";
import { PeriodCalendarAuthProvider } from "./PeriodCalendarAuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

export const PeriodCalendarProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const { t, i18n } = useTranslation();

  return (
    <ManagerProvider manager={periodCalendarManager} queryClient={queryClient}>
      <PeriodCalendarAuthProvider>
        <TranslationProvider t={t} language={i18n.language}>
          <FeatureFlagsProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </FeatureFlagsProvider>
        </TranslationProvider>
      </PeriodCalendarAuthProvider>
    </ManagerProvider>
  );
};
