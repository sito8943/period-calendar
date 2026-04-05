import type { ReactNode } from "react";

export type PageHeaderProps = {
  title: ReactNode;
  onBack?: () => void;
  subtitle?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
};
