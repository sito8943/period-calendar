import type { MouseEvent } from "react";
import type { CalendarDayData } from "../types";

export type CalendarDayProps = {
  day: CalendarDayData;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
};
