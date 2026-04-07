import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// lib
import {
  getMonthDays,
  isSameDay,
  isDateInPeriod,
  hasReportedPeriodInMonth,
  getPredictedPeriodDaysForMonth,
  getFertilityPredictionForMonth,
  toISODateString,
} from "lib";

// components
import { CalendarDay } from "./CalendarDay";

// utils
import { getWeekdays, isDateInRange } from "./utils";

// types
import type { CalendarDayData, CalendarProps } from "./types";

/**
 * Calendar component that displays a monthly view with period days and predictions.
 * @param periods - Array of period data to display on the calendar.
 * @param defaultCycleLength - Default cycle length in days for predictions.
 * @param defaultPeriodLength - Default period length in days for predictions.
 * @returns A calendar view with navigation and day indicators.
 */
export function Calendar({
  periods,
  dailyLogs,
  defaultCycleLength,
  defaultPeriodLength,
  onDayClick,
}: CalendarProps) {
  const { i18n, t } = useTranslation();
  const today = useMemo(() => new Date(), []);
  const dailyLogDateSet = useMemo(
    () => new Set(dailyLogs.map((item) => item.date)),
    [dailyLogs],
  );

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [monthTransitionDirection, setMonthTransitionDirection] = useState<
    "next" | "prev"
  >("next");

  const weekdays = getWeekdays(i18n.language);
  const monthPrediction = useMemo(
    () =>
      getPredictedPeriodDaysForMonth(
        periods,
        defaultCycleLength,
        defaultPeriodLength,
        currentYear,
        currentMonth,
      ),
    [
      periods,
      defaultCycleLength,
      defaultPeriodLength,
      currentYear,
      currentMonth,
    ],
  );
  const monthFertilityPrediction = useMemo(
    () =>
      getFertilityPredictionForMonth(
        periods,
        defaultCycleLength,
        currentYear,
        currentMonth,
      ),
    [periods, defaultCycleLength, currentYear, currentMonth],
  );
  const monthHasReportedPeriod = useMemo(
    () => hasReportedPeriodInMonth(periods, currentYear, currentMonth),
    [periods, currentYear, currentMonth],
  );
  const ovulationDaySet = useMemo(
    () =>
      new Set(
        (monthFertilityPrediction?.ovulationDays ?? []).map((day) =>
          toISODateString(day),
        ),
      ),
    [monthFertilityPrediction],
  );

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    i18n.language,
    { month: "long", year: "numeric" },
  );
  const monthTransitionKey = `${currentYear}-${currentMonth}`;

  const goToPreviousMonth = () => {
    setMonthTransitionDirection("prev");
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setMonthTransitionDirection("next");
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const calendarDays = useMemo<CalendarDayData[]>(() => {
    const days = getMonthDays(currentYear, currentMonth);

    // pad start with previous month days
    const firstDayOfWeek = days[0].getDay();
    // Convert Sunday=0 to Monday-based: Mon=0, Tue=1, ..., Sun=6
    const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const paddedDays: CalendarDayData[] = [];

    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth, -i);
      paddedDays.push({
        date: d,
        isCurrentMonth: false,
        isToday: false,
        hasReportedPeriodInMonth: false,
        isPeriodDay: false,
        isPredictedDay: false,
        isFertileDay: false,
        isOvulationDay: false,
        hasDailyLog: dailyLogDateSet.has(toISODateString(d)),
      });
    }

    // Current month days
    for (const date of days) {
      const isPeriodDay = periods.some((p) => isDateInPeriod(date, p));
      const isOvulationDay =
        !isPeriodDay && ovulationDaySet.has(toISODateString(date));
      const isFertileDay =
        !isPeriodDay &&
        !isOvulationDay &&
        (monthFertilityPrediction?.fertileWindows.some((window) =>
          isDateInRange(date, window.start, window.end),
        ) ??
          false);
      const isPredictedDay =
        !isPeriodDay &&
        !isOvulationDay &&
        !isFertileDay &&
        monthPrediction !== null &&
        isDateInRange(date, monthPrediction.start, monthPrediction.end);

      paddedDays.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        hasReportedPeriodInMonth: monthHasReportedPeriod,
        isPeriodDay,
        isPredictedDay,
        isFertileDay,
        isOvulationDay,
        hasDailyLog: dailyLogDateSet.has(toISODateString(date)),
      });
    }

    // Next month padding to complete the grid (fill to 42 or nearest row of 7)
    const remainder = paddedDays.length % 7;
    if (remainder > 0) {
      const nextMonthDays = 7 - remainder;
      for (let i = 1; i <= nextMonthDays; i++) {
        const d = new Date(currentYear, currentMonth + 1, i);
        paddedDays.push({
          date: d,
          isCurrentMonth: false,
          isToday: false,
          hasReportedPeriodInMonth: false,
          isPeriodDay: false,
          isPredictedDay: false,
          isFertileDay: false,
          isOvulationDay: false,
          hasDailyLog: dailyLogDateSet.has(toISODateString(d)),
        });
      }
    }

    return paddedDays;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- today is stable for the component's lifetime
  }, [
    currentYear,
    currentMonth,
    periods,
    monthPrediction,
    monthFertilityPrediction,
    monthHasReportedPeriod,
    ovulationDaySet,
    dailyLogDateSet,
  ]);

  return (
    <div className="bg-base-light rounded-xl p-4 shadow-sm calendar-shell">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-base-dark transition-colors calendar-nav-button"
          aria-label={t("_accessibility:calendar.previousMonth")}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-text-muted" />
        </button>
        <h2
          key={monthName}
          className="text-lg font-semibold capitalize text-text calendar-month-label"
        >
          {monthName}
        </h2>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-base-dark transition-colors calendar-nav-button"
          aria-label={t("_accessibility:calendar.nextMonth")}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-text-muted" />
        </button>
      </div>

      <div
        key={monthTransitionKey}
        className={`calendar-month-panel ${monthTransitionDirection === "next" ? "calendar-month-next" : "calendar-month-prev"}`}
      >
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-text-muted"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div key={index} className="flex items-center justify-center">
              <CalendarDay
                day={day}
                onClick={
                  onDayClick
                    ? (event) =>
                        onDayClick(
                          toISODateString(day.date),
                          event.currentTarget,
                        )
                    : undefined
                }
                ariaLabel={t("_accessibility:calendar.selectDay", {
                  day: day.date.toLocaleDateString(i18n.language),
                })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 legend-dot legend-dot-today" />
          <span>{t("_pages:calendar.today")}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 legend-dot legend-dot-period" />
          <span>{t("_pages:calendar.period")}</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`w-3 h-3 legend-dot ${
              monthHasReportedPeriod
                ? "legend-dot-ovulation-dashed"
                : "legend-dot-ovulation-predicted"
            }`}
          />
          <span>{t("_pages:calendar.ovulation")}</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`w-3 h-3 legend-dot ${
              monthHasReportedPeriod
                ? "legend-dot-fertile-dashed"
                : "legend-dot-fertile-predicted"
            }`}
          />
          <span>{t("_pages:calendar.fertileDays")}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 legend-dot legend-dot-prediction" />
          <span>{t("_pages:calendar.prediction")}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          <span>{t("_pages:calendar.dailyLog")}</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-text-muted">
        {t("_pages:calendar.fertilityDisclaimer")}
      </p>
      {monthFertilityPrediction &&
        monthFertilityPrediction.variabilityPaddingDays > 0 && (
          <p className="mt-1 text-xs text-text-muted">
            {t("_pages:calendar.fertilityWindowWithMargin", {
              days: monthFertilityPrediction.variabilityPaddingDays,
            })}
          </p>
        )}
    </div>
  );
}
