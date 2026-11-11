/**
 * False after a hard reload (Ctrl/Cmd+Shift+R): the browser bypasses the
 * service worker, so the page has no controller and already runs the latest build.
 */
export const isPageControlledBySW = (): boolean =>
  Boolean(navigator.serviceWorker?.controller);
