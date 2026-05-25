import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

// lib
import { getPeriodDurationDays, getPeriodLogDetailRoute } from "lib";

// constants
import { PERIOD_CARD_CLASSNAMES } from "./constants";

// types
import type { PeriodCardProps } from "./types";

// utils
import { getEndedPeriodSubtitle, getPeriodStartLabel } from "./utils";

export function PeriodCard({ period }: PeriodCardProps) {
  const { t, i18n } = useTranslation();
  const duration = getPeriodDurationDays(period);

  return (
    <Link
      to={getPeriodLogDetailRoute(period.id)}
      className={PERIOD_CARD_CLASSNAMES.root}
    >
      <div className={PERIOD_CARD_CLASSNAMES.content}>
        <div className={PERIOD_CARD_CLASSNAMES.dateRow}>
          <span className={PERIOD_CARD_CLASSNAMES.dateDot} />
          <span className={PERIOD_CARD_CLASSNAMES.date}>
            {getPeriodStartLabel(period.startDate, i18n.language)}
          </span>
        </div>
        <div className={PERIOD_CARD_CLASSNAMES.subtitle}>
          {period.endDate ? (
            <>
              {getEndedPeriodSubtitle(
                period.endDate,
                duration,
                i18n.language,
                t,
              )}
            </>
          ) : (
            <span className={PERIOD_CARD_CLASSNAMES.ongoing}>
              {t("_pages:history.ongoing")}
            </span>
          )}
        </div>
      </div>
      <FontAwesomeIcon
        icon={faChevronRight}
        className={PERIOD_CARD_CLASSNAMES.chevron}
      />
    </Link>
  );
}
