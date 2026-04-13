import type { ReactNode } from "react";

export interface AnimatedDropdownProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  className?: string;
}
