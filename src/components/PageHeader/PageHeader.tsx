import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@sito/dashboard-app";
import { PAGE_HEADER_CLASSNAMES } from "./constants";
import type { PageHeaderProps } from "./types";
import { joinClasses } from "./utils";

export function PageHeader({
  title,
  onBack,
  subtitle,
  rightContent,
  className,
}: PageHeaderProps) {
  return (
    <div className={joinClasses(PAGE_HEADER_CLASSNAMES.root, className)}>
      <header className={PAGE_HEADER_CLASSNAMES.header}>
        {onBack ? <IconButton onClick={onBack} icon={faArrowLeft} /> : null}
        <h1 className={PAGE_HEADER_CLASSNAMES.title}>{title}</h1>
        {rightContent ? (
          <div className={PAGE_HEADER_CLASSNAMES.rightContent}>{rightContent}</div>
        ) : null}
      </header>
      {subtitle ? <p className={PAGE_HEADER_CLASSNAMES.subtitle}>{subtitle}</p> : null}
    </div>
  );
}
