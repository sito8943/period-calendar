import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { isPageControlledBySW } from "./utils";

export function useServiceWorkerUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const isControlled = isPageControlledBySW();

  // After a hard reload the page already runs the new build, but the new
  // worker is still waiting. vite-plugin-pwa only reloads on `controlling`
  // when the page was controlled at load, so prompting here never finishes.
  // Activate the waiting worker silently instead.
  useEffect(() => {
    if (!needRefresh || isControlled) return;
    setNeedRefresh(false);
    void updateServiceWorker();
  }, [needRefresh, isControlled, setNeedRefresh, updateServiceWorker]);

  const dismissUpdate = () => {
    setNeedRefresh(false);
  };

  const applyUpdate = () => {
    void updateServiceWorker();
  };

  return {
    needRefresh: needRefresh && isControlled,
    dismissUpdate,
    applyUpdate,
  };
}
