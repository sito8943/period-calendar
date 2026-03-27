import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// hooks
import { usePeriodsList } from "hooks";

// providers
import { useRegisterBottomNavAction } from "providers";

// components
import { PeriodCard } from "components";

export function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: periods = [] } = usePeriodsList();

  const goToLog = useCallback(() => navigate("/log"), [navigate]);
  useRegisterBottomNavAction(goToLog);

  return (
    <main className="flex-1 p-4 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-text">
          {t("_pages:history.title")}
        </h1>
        <Button
          variant="submit"
          color="primary"
          onClick={goToLog}
          className="hidden sm:flex !px-4 !py-1.5 !text-sm"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
          {t("_pages:home.logPeriod")}
        </Button>
      </div>

      {periods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-muted">
          <p className="text-lg">{t("_pages:history.empty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {periods.map((period) => (
            <PeriodCard key={period.id} period={period} />
          ))}
        </div>
      )}
    </main>
  );
}
