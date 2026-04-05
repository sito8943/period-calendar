import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// hooks
import { usePeriodsList } from "hooks";

// providers
import { useRegisterBottomNavAction } from "providers";

// components
import { PageHeader, PeriodCard } from "components";

export function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: periods = [] } = usePeriodsList();

  const goToLog = useCallback(() => navigate("/log"), [navigate]);
  useRegisterBottomNavAction(goToLog);

  return (
    <main className="flex-1 p-4 max-w-lg mx-auto w-full">
      <PageHeader title={t("_pages:history.title")} onBack={() => navigate(-1)} />

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
