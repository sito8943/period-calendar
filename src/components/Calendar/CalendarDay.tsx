import type { CalendarDayProps } from "./types";

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
