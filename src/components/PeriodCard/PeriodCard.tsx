import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

// lib
import { formatDate, getPeriodDurationDays } from "lib";
import type { PeriodCardProps } from "./types";

export function PeriodCard({ period }: PeriodCardProps) {
  const { t, i18n } = useTranslation();
  const duration = getPeriodDurationDays(period);

  return (
    <Link
      to={`/log/${period.id}`}
      className="flex items-center justify-between p-4 bg-base-light rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          <span className="font-medium text-text">
            {formatDate(period.startDate, i18n.language)}
          </span>
        </div>
        <div className="text-sm text-text-muted ml-4.5">
          {period.endDate ? (
            <>
              {t("_pages:history.ended")}: {formatDate(period.endDate, i18n.language)}
              {" - "}
              {t("_pages:history.duration", { days: duration })}
            </>
          ) : (
            <span className="text-primary font-medium">
              {t("_pages:history.ongoing")}
            </span>
          )}
        </div>
      </div>
      <FontAwesomeIcon icon={faChevronRight} className="text-text-muted/50" />
    </Link>
  );
}
