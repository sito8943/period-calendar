import { useRegisterSW } from "virtual:pwa-register/react";

export function useServiceWorkerUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const dismissUpdate = () => {
    setNeedRefresh(false);
  };

  const applyUpdate = () => {
    void updateServiceWorker();
  };

  return {
    needRefresh,
    dismissUpdate,
    applyUpdate,
  };
}
