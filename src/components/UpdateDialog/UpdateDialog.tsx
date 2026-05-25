import { useTranslation } from "react-i18next";

import { PwaUpdateDialog } from "@sito/dashboard-app";

import { useServiceWorkerUpdate } from "./useServiceWorkerUpdate";

export function UpdateDialog() {
  const { t } = useTranslation();
  const { needRefresh, dismissUpdate, applyUpdate } = useServiceWorkerUpdate();

  return (
    <PwaUpdateDialog
      open={needRefresh}
      onDismiss={dismissUpdate}
      onUpdate={applyUpdate}
      title={t("_pages:pwaUpdate.title")}
      description={t("_pages:pwaUpdate.description")}
      dismissLabel={t("_pages:pwaUpdate.actions.later")}
      updateLabel={t("_pages:pwaUpdate.actions.update")}
    />
  );
}
