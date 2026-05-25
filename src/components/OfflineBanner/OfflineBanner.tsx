import { OfflineBanner as DashboardAppOfflineBanner } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { useOnlineStatus } from "hooks";

import type { OfflineBannerProps } from "./types";

export function OfflineBanner({ forceVisible = false }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline && !forceVisible) return null;

  return (
    <DashboardAppOfflineBanner
      isOnline={false}
      className="offline-banner-shell"
      message={t("_accessibility:offline.banner")}
    />
  );
}
