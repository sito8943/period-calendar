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
import { Calendar, PredictionCard } from "components";

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: periods = [] } = usePeriodsList();
  const { data: dailyLogs = [] } = useDailyLogsList();
  const { data: settings = DEFAULT_SETTINGS } = useSettings();

  const stats = useCycleStats(periods, settings);
  const nextPeriodMessage = useMemo(() => {
    if (stats.daysUntilNext === null) return t("_pages:home.noData");
    if (stats.daysUntilNext > 0) {
      return t("_pages:home.alerts.periodInDays", { days: stats.daysUntilNext });
    }
    if (stats.daysUntilNext === 0) return t("_pages:home.alerts.periodToday");
    return t("_pages:home.daysAgo", { days: Math.abs(stats.daysUntilNext) });
  }, [stats.daysUntilNext, t]);
  const showMissingPeriodThisMonthAlert =
    periods.length > 0 && !stats.hasReportedPeriodThisMonth;
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
      {/* Prediction cards */}
      <div className="flex flex-col gap-3">
        <PredictionCard
          title={t("_pages:home.nextPeriod")}
          message={nextPeriodMessage}
          variant="primary"
          messageClassName={
            stats.daysUntilNext === null
              ? "text-lg max-sm:text-base font-medium opacity-85"
              : undefined
          }
        />
        {stats.isInFertileWindowToday ? (
          <PredictionCard
            title={t("_pages:home.alerts.fertileTitle")}
            message={t("_pages:home.alerts.fertileMessage")}
            variant="fertile"
            messageClassName="text-lg max-sm:text-base"
          />
        ) : null}
        {showMissingPeriodThisMonthAlert ? (
          <PredictionCard
            title={t("_pages:home.alerts.missingPeriodTitle")}
            message={t("_pages:home.alerts.missingPeriodMessage")}
            variant="error"
            messageClassName="text-lg max-sm:text-base"
          />
        ) : null}
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
