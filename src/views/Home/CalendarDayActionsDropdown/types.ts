import type { CalendarDayData } from "components";

export interface CalendarDayActionsDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  selectedDate: string | null;
  dayData: CalendarDayData | null;
  onClose: () => void;
}
