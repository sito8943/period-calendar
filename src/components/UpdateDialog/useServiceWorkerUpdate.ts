import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

import { isPageControlledBySW, scheduleUpdateChecks } from "./utils";

export function useServiceWorkerUpdate() {
  const { t } = useTranslation();
  const { showSuccessNotification } = useNotification();
  const [updating, setUpdating] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: scheduleUpdateChecks,
    onRegisterError: (error) => {
      console.error(error);
    },
  });

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

  useEffect(() => {
    if (!offlineReady) return;
    showSuccessNotification({ message: t("_pages:pwaUpdate.offlineReady") });
    setOfflineReady(false);
  }, [offlineReady, setOfflineReady, showSuccessNotification, t]);

  const dismissUpdate = () => {
    setNeedRefresh(false);
  };

  const applyUpdate = async () => {
    setUpdating(true);
    // Activates the waiting worker; the page reloads when it takes control
    await updateServiceWorker(true);
  };

  return {
    needRefresh: needRefresh && isControlled,
    updating,
    dismissUpdate,
    applyUpdate,
  };
}
