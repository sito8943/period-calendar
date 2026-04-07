import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, IconButton } from "@sito/dashboard-app";
import { CALENDAR_LEGEND_DROPDOWN_CLOSE_DELAY_MS } from "./constants";
import type { CalendarLegendDropdownProps } from "./types";

export function CalendarLegendDropdown({
  monthHasReportedPeriod,
}: CalendarLegendDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current === null) return;
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const openFromAnchor = useCallback(
    (button: HTMLButtonElement) => {
      clearCloseTimeout();
      setAnchorEl(button);
      setIsOpen(true);
    },
    [clearCloseTimeout],
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, CALENDAR_LEGEND_DROPDOWN_CLOSE_DELAY_MS);
  }, [clearCloseTimeout]);

  const handleButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (isOpen) {
        clearCloseTimeout();
        setIsOpen(false);
        return;
      }
      openFromAnchor(event.currentTarget);
    },
    [clearCloseTimeout, isOpen, openFromAnchor],
  );

  const handleDropdownClose = useCallback(() => {
    clearCloseTimeout();
    setIsOpen(false);
  }, [clearCloseTimeout]);

  useEffect(() => clearCloseTimeout, [clearCloseTimeout]);

  return (
    <div
      className="calendar-legend-trigger"
      onMouseEnter={clearCloseTimeout}
      onMouseLeave={scheduleClose}
    >
      <IconButton
        type="button"
        icon={faCircleInfo}
        variant="text"
        className="calendar-legend-info-button"
        name={t("_accessibility:calendar.openLegend")}
        aria-label={t("_accessibility:calendar.openLegend")}
        onMouseEnter={(event) => openFromAnchor(event.currentTarget)}
        onClick={handleButtonClick}
      />
      <Dropdown open={isOpen} onClose={handleDropdownClose} anchorEl={anchorEl}>
        <div
          className="calendar-legend-dropdown"
          onMouseEnter={clearCloseTimeout}
          onMouseLeave={scheduleClose}
        >
          <p className="calendar-legend-title">{t("_pages:calendar.legendTitle")}</p>
          <div className="calendar-legend-list">
            <div className="calendar-legend-row">
              <span className="w-3 h-3 legend-dot legend-dot-today" />
              <span>{t("_pages:calendar.today")}</span>
            </div>
            <div className="calendar-legend-row">
              <span className="w-3 h-3 legend-dot legend-dot-period" />
              <span>{t("_pages:calendar.period")}</span>
            </div>
            <div className="calendar-legend-row">
              <span
                className={`w-3 h-3 legend-dot ${
                  monthHasReportedPeriod
                    ? "legend-dot-ovulation-dashed"
                    : "legend-dot-ovulation-predicted"
                }`}
              />
              <span>{t("_pages:calendar.ovulation")}</span>
            </div>
            <div className="calendar-legend-row">
              <span
                className={`w-3 h-3 legend-dot ${
                  monthHasReportedPeriod
                    ? "legend-dot-fertile-dashed"
                    : "legend-dot-fertile-predicted"
                }`}
              />
              <span>{t("_pages:calendar.fertileDays")}</span>
            </div>
            <div className="calendar-legend-row">
              <span className="w-3 h-3 legend-dot legend-dot-prediction" />
              <span>{t("_pages:calendar.prediction")}</span>
            </div>
            <div className="calendar-legend-row">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span>{t("_pages:calendar.dailyLog")}</span>
            </div>
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
