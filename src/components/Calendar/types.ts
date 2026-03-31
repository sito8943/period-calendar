import type { Period } from "lib";

export type CalendarDayData = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPeriodDay: boolean;
  isPredictedDay: boolean;
};

export type CalendarProps = {
  periods: Period[];
  defaultCycleLength: number;
  defaultPeriodLength: number;
};

export type CalendarDayProps = {
  day: CalendarDayData;
};
