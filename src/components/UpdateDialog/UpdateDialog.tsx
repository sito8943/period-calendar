import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

// @sito/dashboard-app
import { Button, Dialog } from "@sito/dashboard-app";

export const UpdateDialog = () => {
  const { t } = useTranslation();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const handleCloseUpdateDialog = () => {
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    void updateServiceWorker();
  };

  return (
    <Dialog
      open={needRefresh} // needRefresh
      title={t("_pages:pwaUpdate.title")}
      handleClose={handleCloseUpdateDialog}
      containerClassName="!items-end pb-3"
    >
      <p className="text-sm text-text-muted">
        {t("_pages:pwaUpdate.description")}
      </p>
      <div className="mt-5 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outlined"
          onClick={handleCloseUpdateDialog}
        >
          {t("_pages:pwaUpdate.actions.later")}
        </Button>
        <Button
          type="button"
          variant="submit"
          color="primary"
          onClick={handleUpdate}
        >
          {t("_pages:pwaUpdate.actions.update")}
        </Button>
      </div>
    </Dialog>
  );
};
