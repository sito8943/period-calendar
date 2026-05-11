import { Suspense } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Button, Dialog, SplashScreen } from "@sito/dashboard-app";
import { useRegisterSW } from "virtual:pwa-register/react";

// routes
import { Routes } from "./Routes";

function App() {
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
    <Suspense fallback={<SplashScreen />}>
      <Routes />
      <Dialog
        open={true}
        title={t("_pages:pwaUpdate.title")}
        handleClose={handleCloseUpdateDialog}
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
    </Suspense>
  );
}

export default App;
