import type { CalendarDayProps } from "./types";

/**
 * CalendarDay component that represents a single day in the calendar.
 * @param day - Object containing the day data, including date, current month status, today status, period day status, and predicted day status.
 * @returns A styled div representing the calendar day, with different styles based on its status (current month, today, period day, predicted day).
 */
export function CalendarDay({ day }: CalendarDayProps) {
  const { date, isCurrentMonth, isToday, isPeriodDay, isPredictedDay } = day;

  const baseClasses = "w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors";

  let colorClasses = "";
  if (!isCurrentMonth) {
    colorClasses = "text-text-muted/30";
  } else if (isPeriodDay) {
    colorClasses = "period-day";
  } else if (isPredictedDay) {
    colorClasses = "predicted-day";
  } else {
    colorClasses = "text-text";
  }

  const todayClasses = isToday && !isPeriodDay && !isPredictedDay ? "today-marker" : "";

  return (
    <div className={`${baseClasses} ${colorClasses} ${todayClasses}`}>
      {date.getDate()}
    </div>
  );
}
