export interface CalendarDayActionsDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  selectedDate: string | null;
  onClose: () => void;
}
