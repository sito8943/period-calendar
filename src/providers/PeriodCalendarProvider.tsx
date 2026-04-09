import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  NotificationProvider,
  SupabaseAuthProvider,
  SupabaseManagerProvider,
  TranslationProvider,
} from "@sito/dashboard-app";

import type { BasicProviderPropTypes } from "./types";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

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
  const withSupabase = isSupabaseConfigured() && supabase !== null;
  const supabaseClient = withSupabase ? supabase : null;

  const content = withSupabase && supabaseClient ? (
    <SupabaseManagerProvider supabase={supabaseClient} queryClient={queryClient}>
      <SupabaseAuthProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </SupabaseAuthProvider>
    </SupabaseManagerProvider>
  ) : (
    <NotificationProvider>{children}</NotificationProvider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider t={t} language={i18n.language}>
        {content}
      </TranslationProvider>
    </QueryClientProvider>
  );
};
