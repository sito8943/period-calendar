import type { CalendarDayProps } from "./types";

/**
 * CalendarDay component that represents a single day in the calendar.
 * @param day - Object containing the day data, including date, current month status, today status, period day status, and predicted day status.
 * @returns A styled div representing the calendar day, with different styles based on its status (current month, today, period day, predicted day).
 */
export function CalendarDay({ day, onClick, ariaLabel }: CalendarDayProps) {
  const {
    date,
    isCurrentMonth,
    isToday,
    isPeriodDay,
    isPredictedDay,
    isFertileDay,
    isOvulationDay,
    hasDailyLog,
  } = day;

  const baseClasses =
    "calendar-day-button w-9 h-9 relative flex items-center justify-center rounded-full text-sm transition-colors";

  let colorClasses = "";
  if (!isCurrentMonth) {
    colorClasses = "text-text-muted/30";
  } else if (isPeriodDay) {
    colorClasses = "period-day";
  } else if (isOvulationDay) {
    colorClasses = "ovulation-day";
  } else if (isFertileDay) {
    colorClasses = "fertile-day";
  } else if (isPredictedDay) {
    colorClasses = "predicted-day";
  } else {
    colorClasses = "text-text";
  }

  const todayClasses =
    isToday && !isPeriodDay && !isPredictedDay && !isFertileDay && !isOvulationDay
      ? "today-marker"
      : "";
  const isSpecialDay =
    isPeriodDay || isPredictedDay || isFertileDay || isOvulationDay;
  const interactiveClasses = onClick
    ? isSpecialDay
      ? "cursor-pointer"
      : "hover:bg-base-dark/60 cursor-pointer"
    : "cursor-default";
  const dailyLogDotClass = isPeriodDay
    ? "bg-white"
    : isOvulationDay
      ? "bg-ovulation"
      : isFertileDay
        ? "bg-fertile"
        : isPredictedDay
          ? "bg-period"
          : "bg-primary";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={ariaLabel}
      className={`${baseClasses} ${colorClasses} ${todayClasses} ${interactiveClasses}`}
    >
      {date.getDate()}
      {hasDailyLog && (
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dailyLogDotClass}`}
        />
      )}
    </button>
  );
}
