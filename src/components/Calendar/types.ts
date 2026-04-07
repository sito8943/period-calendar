import type { DailyLog, Period } from "lib";
import type { MouseEvent } from "react";

export type CalendarDayData = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasReportedPeriodInMonth: boolean;
  isPeriodDay: boolean;
  isPredictedDay: boolean;
  isFertileDay: boolean;
  isOvulationDay: boolean;
  hasDailyLog: boolean;
};

export type CalendarProps = {
  periods: Period[];
  dailyLogs: DailyLog[];
  defaultCycleLength: number;
  defaultPeriodLength: number;
  onDayClick?: (date: string, anchorEl: HTMLButtonElement) => void;
};

export type CalendarDayProps = {
  day: CalendarDayData;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
};
