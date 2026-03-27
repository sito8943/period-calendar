import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  NotificationProvider,
  TranslationProvider,
} from "@sito/dashboard-app";

import type { BasicProviderPropTypes } from "./types";

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
    <QueryClientProvider client={queryClient}>
      <TranslationProvider t={t} language={i18n.language}>
        <NotificationProvider>{children}</NotificationProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};
