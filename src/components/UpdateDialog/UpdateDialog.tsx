import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { Dialog, DialogActions } from "@sito/ui";

import { useServiceWorkerUpdate } from "./useServiceWorkerUpdate";

/**
 * Asks the user to reload when a new version of the app is installed in the
 * background, and confirms once the app can work offline.
 */
export function UpdateDialog() {
  const { t } = useTranslation();
  const { needRefresh, updating, dismissUpdate, applyUpdate } =
    useServiceWorkerUpdate();

  return (
    <Dialog
      closeIcon={<FontAwesomeIcon icon={faXmark} />}
      open={needRefresh}
      title={t("_pages:pwaUpdate.title")}
      onClose={dismissUpdate}
      closeLabel={t("_accessibility:ariaLabels.closeDialog")}
      closeOnBackdropClick={!updating}
      closeOnEscape={!updating}
      showCloseButton={!updating}
    >
      <p className="mb-4">{t("_pages:pwaUpdate.description")}</p>
      <DialogActions
        alignEnd
        primaryText={t("_pages:pwaUpdate.actions.update")}
        cancelText={t("_pages:pwaUpdate.actions.later")}
        onPrimaryClick={() => void applyUpdate()}
        onCancel={dismissUpdate}
        isLoading={updating}
        disabled={updating}
        primaryProps={{ color: "primary", variant: "submit" }}
      />
    </Dialog>
  );
}
