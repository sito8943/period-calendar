import {
  setServerReachable,
  useOnlineStatusSnapshot,
  type OnlineStatusSnapshot,
} from "@sito/dashboard-app";

import { onlineStatusOptions } from "./constants";

/**
 * Returns true when the browser has network connectivity.
 * Also reflects when the backend is unavailable, even if the browser is online.
 */
export function useOnlineStatus(): boolean {
  return useOnlineStatusSnapshot(onlineStatusOptions).isOnline;
}

export { setServerReachable, useOnlineStatusSnapshot };
export type { OnlineStatusSnapshot };
