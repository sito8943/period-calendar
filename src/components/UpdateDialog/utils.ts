import { SW_UPDATE_CHECK_INTERVAL_MS } from "./constants";

/**
 * Polls for a new service worker so long-lived tabs also see updates.
 * Skips the check while offline or while a worker is still installing.
 */
export const scheduleUpdateChecks = (
  swUrl: string,
  registration: ServiceWorkerRegistration | undefined,
): void => {
  if (!registration) return;

  setInterval(async () => {
    if (registration.installing || !navigator.onLine) return;

    const response = await fetch(swUrl, {
      cache: "no-store",
      headers: { cache: "no-store", "cache-control": "no-cache" },
    });
    if (response.status === 200) await registration.update();
  }, SW_UPDATE_CHECK_INTERVAL_MS);
};

/**
 * False after a hard reload (Ctrl/Cmd+Shift+R): the browser bypasses the
 * service worker, so the page has no controller and already runs the latest build.
 */
export const isPageControlledBySW = (): boolean =>
  Boolean(navigator.serviceWorker?.controller);
