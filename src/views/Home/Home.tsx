import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// hooks
import {
  usePeriodsList,
  useSettings,
  useCycleStats,
  useDailyLogsList,
  useProfileSettings,
} from "hooks";

// lib
import {
  AppRoutes,
  DEFAULT_PROFILE_SETTINGS,
  DEFAULT_SETTINGS,
  getDailyLogRoute,
  toISODateString,
} from "lib";

// components
import { Calendar, PredictionCard } from "components";
import type { CalendarDayData } from "components";
import { CalendarDayActionsDropdown } from "./CalendarDayActionsDropdown";

// constants
import { HOME_PREDICTION_CARD_DISMISS_KEYS } from "./constants";

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: periods = [] } = usePeriodsList();
  const { data: dailyLogs = [] } = useDailyLogsList();
  const { data: settings = DEFAULT_SETTINGS } = useSettings();
  const { data: profile = DEFAULT_PROFILE_SETTINGS } = useProfileSettings();
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    string | null
  >(null);
  const [selectedDayData, setSelectedDayData] =
    useState<CalendarDayData | null>(null);
  const [calendarActionAnchorEl, setCalendarActionAnchorEl] =
    useState<HTMLElement | null>(null);

  const stats = useCycleStats(periods, settings);
  const closePredictionCardAriaLabel = t(
    "_accessibility:ariaLabels.closePredictionCard",
  );
  const nextPeriodMessage = useMemo(() => {
    if (stats.daysUntilNext === null) return t("_pages:home.noData");
    if (stats.daysUntilNext > 0) {
      return t("_pages:home.alerts.periodInDays", {
        days: stats.daysUntilNext,
      });
    }
    if (stats.daysUntilNext === 0) return t("_pages:home.alerts.periodToday");
    return t("_pages:home.daysAgo", { days: Math.abs(stats.daysUntilNext) });
  }, [stats.daysUntilNext, t]);
  const showMissingPeriodThisMonthAlert =
    periods.length > 0 && !stats.hasReportedPeriodThisMonth;
  const fertileMessage = useMemo(() => {
    const normalizedPartnerName = profile.partnerName.trim();
    if (profile.theme === "boy" && normalizedPartnerName.length > 0) {
      return t("_pages:home.alerts.fertileMessageNamed", {
        name: normalizedPartnerName,
      });
    }

    return t("_pages:home.alerts.fertileMessage");
  }, [profile.partnerName, profile.theme, t]);
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

  const goToLog = useCallback(() => navigate(AppRoutes.PeriodLog), [navigate]);
  const closeCalendarDayActions = useCallback(() => {
    setSelectedCalendarDate(null);
    setSelectedDayData(null);
    setCalendarActionAnchorEl(null);
  }, []);
  const openCalendarDayActions = useCallback(
    (date: string, anchorEl: HTMLButtonElement, dayData: CalendarDayData) => {
      setSelectedCalendarDate(date);
      setSelectedDayData(dayData);
      setCalendarActionAnchorEl(anchorEl);
    },
    [],
  );
  const goToDailyLog = useCallback(
    (date: string) => navigate(getDailyLogRoute(date)),
    [navigate],
  );
  const goToTodayDailyLog = useCallback(
    () => goToDailyLog(toISODateString(new Date())),
    [goToDailyLog],
  );
  const showCalendarDayActions =
    selectedCalendarDate !== null && calendarActionAnchorEl !== null;

  return (
    <main className="page-content-stacked home-enter-stagger">
      {/* Prediction cards */}
      <div className="content-stack">
        <PredictionCard
          title={t("_pages:home.nextPeriod")}
          message={nextPeriodMessage}
          closeAriaLabel={closePredictionCardAriaLabel}
          dismissStorageKey={HOME_PREDICTION_CARD_DISMISS_KEYS.nextPeriod}
          variant="primary"
          messageClassName={
            stats.daysUntilNext === null
              ? "prediction-card-message-muted"
              : undefined
          }
        />
        {stats.isInFertileWindowToday ? (
          <PredictionCard
            title={t("_pages:home.alerts.fertileTitle")}
            message={fertileMessage}
            closeAriaLabel={closePredictionCardAriaLabel}
            dismissStorageKey={HOME_PREDICTION_CARD_DISMISS_KEYS.fertile}
            variant="fertile"
            messageClassName=""
          />
        ) : null}
        {showMissingPeriodThisMonthAlert ? (
          <PredictionCard
            title={t("_pages:home.alerts.missingPeriodTitle")}
            message={t("_pages:home.alerts.missingPeriodMessage")}
            closeAriaLabel={closePredictionCardAriaLabel}
            dismissStorageKey={HOME_PREDICTION_CARD_DISMISS_KEYS.missingPeriod}
            variant="error"
            messageClassName=""
          />
        ) : null}
      </div>

      {/* Calendar */}
      <Calendar
        periods={periods}
        dailyLogs={dailyLogs}
        defaultCycleLength={settings.defaultCycleLength}
        defaultPeriodLength={settings.defaultPeriodLength}
        onDayClick={openCalendarDayActions}
      />
      <CalendarDayActionsDropdown
        open={showCalendarDayActions}
        anchorEl={calendarActionAnchorEl}
        selectedDate={selectedCalendarDate}
        dayData={selectedDayData}
        onClose={closeCalendarDayActions}
      />

      {/* Stats row */}
      {periods.length > 0 && (
        <div className="metric-grid">
          <div className="metric-card-centered">
            <p className="metric-label">{t("_pages:home.stats.avgCycle")}</p>
            <p className="metric-value">
              {stats.avgCycleLength
                ? t("_pages:home.stats.days", { count: stats.avgCycleLength })
                : t("_pages:home.stats.noData")}
            </p>
          </div>
          <div className="metric-card-centered">
            <p className="metric-label">{t("_pages:home.stats.avgDuration")}</p>
            <p className="metric-value">
              {stats.avgPeriodDuration
                ? t("_pages:home.stats.days", {
                    count: stats.avgPeriodDuration,
                  })
                : t("_pages:home.stats.noData")}
            </p>
          </div>
        </div>
      )}

      {stats.latestCycleVariation && cycleVariationMessage && (
        <div className="metric-card">
          <p className="metric-label">{t("_pages:home.variation.title")}</p>
          <p className="metric-value">
            {t("_pages:home.variation.latestCycle", {
              days: stats.latestCycleVariation.latestCycleLength,
            })}
          </p>
          <p className="metric-detail">{cycleVariationMessage}</p>
          {stats.cycleLengthStdDev !== null && (
            <p className="metric-detail-spaced">
              {t("_pages:home.variation.variability", {
                value: stats.cycleLengthStdDev,
              })}
            </p>
          )}
        </div>
      )}

      {/* Log period button (desktop) */}
      <div className="desktop-action-row">
        <Button
          variant="submit"
          color="primary"
          onClick={goToLog}
          className="desktop-action-button"
        >
          <FontAwesomeIcon icon={faPlus} className="button-leading-icon" />
          {t("_pages:home.logPeriod")}
        </Button>
        <Button
          variant="submit"
          color="primary"
          onClick={goToTodayDailyLog}
          className="desktop-action-button"
        >
          {t("_pages:home.logToday")}
        </Button>
      </div>
    </main>
  );
}
