import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// hooks
import { usePeriodsList, useSettings, useCycleStats, useDailyLogsList } from "hooks";

// providers
import { useRegisterBottomNavAction } from "providers";

// lib
import { DEFAULT_SETTINGS, toISODateString } from "lib";

// components
import { Calendar } from "components";

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: periods = [] } = usePeriodsList();
  const { data: dailyLogs = [] } = useDailyLogsList();
  const { data: settings = DEFAULT_SETTINGS } = useSettings();

  const stats = useCycleStats(periods, settings);
  const cycleVariationMessage = useMemo(() => {
    const variation = stats.latestCycleVariation;
    if (!variation) return null;

    if (variation.deltaVsPrevious !== null) {
      if (variation.deltaVsPrevious > 0) {
        return t("_pages:home.variation.longerThanPrevious", {
          days: variation.deltaVsPrevious,
        });
      }
      if (variation.deltaVsPrevious < 0) {
        return t("_pages:home.variation.shorterThanPrevious", {
          days: Math.abs(variation.deltaVsPrevious),
        });
      }
      return t("_pages:home.variation.sameAsPrevious");
    }

    if (variation.deltaVsBaseline !== null) {
      if (variation.deltaVsBaseline > 0) {
        return t("_pages:home.variation.longerThanBaseline", {
          days: variation.deltaVsBaseline,
        });
      }
      if (variation.deltaVsBaseline < 0) {
        return t("_pages:home.variation.shorterThanBaseline", {
          days: Math.abs(variation.deltaVsBaseline),
        });
      }
      return t("_pages:home.variation.sameAsBaseline");
    }

    return t("_pages:home.variation.notEnoughData");
  }, [stats.latestCycleVariation, t]);

  const goToLog = useCallback(() => navigate("/log"), [navigate]);
  const goToDailyLog = useCallback(
    (date: string) => navigate(`/daily-log/${date}`),
    [navigate],
  );
  const goToTodayDailyLog = useCallback(
    () => goToDailyLog(toISODateString(new Date())),
    [goToDailyLog],
  );
  useRegisterBottomNavAction(goToLog);

  return (
    <main className="flex-1 p-4 max-w-lg mx-auto w-full flex flex-col gap-4 home-enter-stagger">
      {/* Prediction card */}
      <div className="bg-primary text-white rounded-xl p-4 shadow-md">
        <h2 className="text-sm font-medium opacity-80">
          {t("_pages:home.nextPeriod")}
        </h2>
        {stats.daysUntilNext !== null ? (
          <p className="text-2xl font-bold mt-1">
            {stats.daysUntilNext > 0
              ? t("_pages:home.daysUntil", { days: stats.daysUntilNext })
              : stats.daysUntilNext === 0
                ? t("_pages:home.today")
                : t("_pages:home.daysAgo", { days: Math.abs(stats.daysUntilNext) })}
          </p>
        ) : (
          <p className="text-lg mt-1 opacity-80">{t("_pages:home.noData")}</p>
        )}
      </div>

      {/* Calendar */}
      <Calendar
        periods={periods}
        dailyLogs={dailyLogs}
        defaultCycleLength={settings.defaultCycleLength}
        defaultPeriodLength={settings.defaultPeriodLength}
        onDayClick={goToDailyLog}
      />

      {/* Stats row */}
      {periods.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-base-light rounded-xl p-3 shadow-sm text-center">
            <p className="text-xs text-text-muted">
              {t("_pages:home.stats.avgCycle")}
            </p>
            <p className="text-lg font-semibold text-text">
              {stats.avgCycleLength
                ? t("_pages:home.stats.days", { count: stats.avgCycleLength })
                : t("_pages:home.stats.noData")}
            </p>
          </div>
          <div className="bg-base-light rounded-xl p-3 shadow-sm text-center">
            <p className="text-xs text-text-muted">
              {t("_pages:home.stats.avgDuration")}
            </p>
            <p className="text-lg font-semibold text-text">
              {stats.avgPeriodDuration
                ? t("_pages:home.stats.days", { count: stats.avgPeriodDuration })
                : t("_pages:home.stats.noData")}
            </p>
          </div>
        </div>
      )}

      {stats.latestCycleVariation && cycleVariationMessage && (
        <div className="bg-base-light rounded-xl p-3 shadow-sm">
          <p className="text-xs text-text-muted">{t("_pages:home.variation.title")}</p>
          <p className="text-lg font-semibold text-text">
            {t("_pages:home.variation.latestCycle", {
              days: stats.latestCycleVariation.latestCycleLength,
            })}
          </p>
          <p className="text-sm text-text-muted">{cycleVariationMessage}</p>
          {stats.cycleLengthStdDev !== null && (
            <p className="text-xs text-text-muted mt-1">
              {t("_pages:home.variation.variability", {
                value: stats.cycleLengthStdDev,
              })}
            </p>
          )}
        </div>
      )}

      {/* Log period button (desktop) */}
      <div className="hidden sm:flex justify-center gap-2 mt-2">
        <Button
          variant="submit"
          color="primary"
          onClick={goToLog}
          className="!px-6"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {t("_pages:home.logPeriod")}
        </Button>
        <Button
          variant="submit"
          color="primary"
          onClick={goToTodayDailyLog}
          className="!px-6"
        >
          {t("_pages:home.logToday")}
        </Button>
      </div>
    </main>
  );
}
