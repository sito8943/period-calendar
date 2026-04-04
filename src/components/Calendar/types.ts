import type { DailyLog, Period } from "lib";

export type CalendarDayData = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
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
  onDayClick?: (date: string) => void;
};

export type CalendarDayProps = {
  day: CalendarDayData;
  onClick?: () => void;
  ariaLabel?: string;
};
