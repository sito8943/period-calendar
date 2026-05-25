// @sito/dashboard-app
import { useTranslation } from "@sito/dashboard-app";

import { classNames } from "lib";

// types
import type { CalendarDayProps } from "./types";

/**
 * CalendarDay component that represents a single day in the calendar.
 * @param day - Object containing the day data, including date, current month status, today status, period day status, and predicted day status.
 * @returns A styled div representing the calendar day, with different styles based on its status (current month, today, period day, predicted day).
 */
export function CalendarDay({ day, onClick, ariaLabel }: CalendarDayProps) {
  const { t } = useTranslation();
  const {
    date,
    isCurrentMonth,
    isToday,
    hasReportedPeriodInMonth,
    isPeriodDay,
    isPredictedDay,
    isFertileDay,
    isOvulationDay,
    hasDailyLog,
  } = day;

  let colorClasses = "";
  if (!isCurrentMonth) {
    colorClasses = "calendar-day-muted";
  } else if (isToday) {
    colorClasses = "today-day";
  } else if (isPeriodDay) {
    colorClasses = "period-day";
  } else if (isOvulationDay) {
    colorClasses = hasReportedPeriodInMonth
      ? "ovulation-day-dashed"
      : "ovulation-day-predicted";
  } else if (isFertileDay) {
    colorClasses = hasReportedPeriodInMonth
      ? "fertile-day-dashed"
      : "fertile-day-predicted";
  } else if (isPredictedDay) {
    colorClasses = "predicted-day";
  } else {
    colorClasses = "calendar-day-default";
  }

  const tooltip = isCurrentMonth
    ? isOvulationDay
      ? t("_pages:calendar.ovulation")
      : isFertileDay
        ? t("_pages:calendar.fertileDays")
        : isPredictedDay
          ? t("_pages:calendar.prediction")
          : undefined
    : undefined;

  const isSpecialDay =
    isToday || isPeriodDay || isPredictedDay || isFertileDay || isOvulationDay;
  const interactiveClasses = onClick
    ? isSpecialDay
      ? "calendar-day-clickable"
      : "calendar-day-clickable-muted"
    : "calendar-day-static";
  const dailyLogDotClass = isToday
    ? "daily-log-dot--today"
    : isPeriodDay
      ? "daily-log-dot--period"
      : isOvulationDay
        ? "daily-log-dot--ovulation"
        : isFertileDay
          ? "daily-log-dot--fertile"
          : isPredictedDay
            ? "daily-log-dot--prediction"
            : "daily-log-dot--default";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={ariaLabel}
      title={tooltip}
      className={classNames(
        "calendar-day-button",
        colorClasses,
        interactiveClasses,
      )}
    >
      {date.getDate()}
      {isPredictedDay && (
        <span
          className={classNames(
            "prediction-indicator",
            isToday && "prediction-indicator-on-today",
          )}
          aria-hidden
        />
      )}
      {isFertileDay && !hasReportedPeriodInMonth && (
        <span
          className={classNames(
            "fertile-prediction-indicator",
            isToday && "prediction-indicator-on-today",
          )}
          aria-hidden
        />
      )}
      {isOvulationDay &&
        (hasReportedPeriodInMonth ? (
          <span
            className={classNames(
              "ovulation-indicator",
              isToday && "ovulation-indicator-on-today",
            )}
            aria-hidden
          />
        ) : (
          <span
            className={classNames(
              "ovulation-prediction-indicator",
              isToday && "prediction-indicator-on-today",
            )}
            aria-hidden
          />
        ))}
      {hasDailyLog && (
        <span className={classNames("daily-log-dot", dailyLogDotClass)} />
      )}
    </button>
  );
}
