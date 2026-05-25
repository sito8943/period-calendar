import type { UseOnlineStatusOptions } from "@sito/dashboard-app";

import { config } from "../../config";

const getServerStatusUrl = (): string | null => {
  if (!config.supabase.enabled) return null;
  return `${config.supabase.url.replace(/\/$/, "")}/auth/v1/health`;
};

const getProbeHeaders = (): HeadersInit => {
  if (!config.supabase.enabled) return {};
  return {
    apikey: config.supabase.anonKey,
  };
};

export const onlineStatusOptions: UseOnlineStatusOptions = {
  checkIntervalMs: 15000,
  probeUrl: getServerStatusUrl(),
  timeoutMs: 5000,
  probeMethod: "GET",
  probeRequestInit: () => ({
    headers: getProbeHeaders(),
  }),
  resolveIsServerReachable: (response) => response.status < 500,
};
