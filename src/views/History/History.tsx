import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// hooks
import { useCanGoBack, usePeriodsList } from "hooks";

// components
import { PageHeader, PeriodCard } from "components";

// constants
import {
  HISTORY_EMPTY_CONTAINER_CLASSNAME,
  HISTORY_LIST_CONTAINER_CLASSNAME,
} from "./constants";

// utils
import { isHistoryEmpty } from "./utils";

export function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const { data: periods = [] } = usePeriodsList();
  const hasNoPeriods = isHistoryEmpty(periods);

  return (
    <main className="flex-1 p-4 max-w-lg mx-auto w-full">
      <PageHeader
        title={t("_pages:history.title")}
        onBack={canGoBack ? () => navigate(-1) : undefined}
      />

      {hasNoPeriods ? (
        <div className={HISTORY_EMPTY_CONTAINER_CLASSNAME}>
          <p className="text-lg">{t("_pages:history.empty")}</p>
        </div>
      ) : (
        <div className={HISTORY_LIST_CONTAINER_CLASSNAME}>
          {periods.map((period) => (
            <PeriodCard key={period.id} period={period} />
          ))}
        </div>
      )}
    </main>
  );
}
