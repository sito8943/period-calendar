import { useTranslation } from "react-i18next";
import { QueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  AuthProvider,
  ManagerProvider,
  NotificationProvider,
  TranslationProvider,
} from "@sito/dashboard-app";

import type { BasicProviderPropTypes } from "./types";
import { config } from "../config";
import { periodCalendarManager } from "../lib/api";
import { AuthSessionBootstrapProvider } from "./AuthSessionBootstrapProvider";
import { FeatureFlagsProvider } from "./FeatureFlags";

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
      <AuthProvider
        guestMode={config.auth.guestMode}
        user={config.auth.user}
        remember={config.auth.remember}
        refreshTokenKey={config.auth.refreshTokenKey}
        accessTokenExpiresAtKey={config.auth.accessTokenExpiresAtKey}
      >
        <AuthSessionBootstrapProvider>
          <TranslationProvider t={t} language={i18n.language}>
            <FeatureFlagsProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </FeatureFlagsProvider>
          </TranslationProvider>
        </AuthSessionBootstrapProvider>
      </AuthProvider>
    </ManagerProvider>
  );
};
