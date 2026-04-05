import type { ReactNode } from "react";

export type PredictionCardVariant = "primary" | "fertile" | "error";

export interface PredictionCardProps {
  title: ReactNode;
  message: ReactNode;
  closeAriaLabel: string;
  dismissStorageKey?: string;
  onClose?: () => void;
  variant?: PredictionCardVariant;
  className?: string;
  messageClassName?: string;
}
