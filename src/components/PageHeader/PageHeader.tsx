import type { ReactNode } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@sito/dashboard-app";

type PageHeaderProps = {
  title: ReactNode;
  onBack?: () => void;
  subtitle?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
};

const joinClasses = (...classes: Array<string | undefined>): string =>
  classes.filter(Boolean).join(" ");

export function PageHeader({
  title,
  onBack,
  subtitle,
  rightContent,
  className,
}: PageHeaderProps) {
  return (
    <div className={joinClasses("mb-6", className)}>
      <header className="flex items-center gap-3">
        {onBack ? <IconButton onClick={onBack} icon={faArrowLeft} /> : null}
        <h1 className="text-xl font-semibold text-text">{title}</h1>
        {rightContent ? <div className="ml-auto">{rightContent}</div> : null}
      </header>
      {subtitle ? <p className="text-sm text-text-muted mt-1">{subtitle}</p> : null}
    </div>
  );
}
