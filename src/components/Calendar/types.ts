import type { DailyLog, Period } from "lib";

export type CalendarDayData = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasReportedPeriodInMonth: boolean;
  isPeriodDay: boolean;
  periodId?: string;
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
  onDayClick?: (
    date: string,
    anchorEl: HTMLButtonElement,
    dayData: CalendarDayData,
  ) => void;
};
