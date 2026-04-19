import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import type { BaseDto, ActionPropsType } from "@sito/dashboard-app";
import { Actions } from "@sito/dashboard-app";
import { AnimatedDropdown } from "components";
import {
  getDailyLogRoute,
  getPeriodLogDetailRoute,
  getPeriodLogRouteWithStartDate,
} from "lib";

// constants
import { CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES } from "./constants";

// types
import type { CalendarDayActionsDropdownProps, DayInfoItem } from "./types";

export function CalendarDayActionsDropdown({
  open,
  anchorEl,
  selectedDate,
  dayData,
  onClose,
}: CalendarDayActionsDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogPeriod = useCallback(() => {
    if (!selectedDate) return;
    if (dayData?.periodId) navigate(getPeriodLogDetailRoute(dayData?.periodId));
    else navigate(getPeriodLogRouteWithStartDate(selectedDate));
    onClose();
  }, [dayData?.periodId, navigate, onClose, selectedDate]);

  const handleLogDailyLog = useCallback(() => {
    if (!selectedDate) return;
    navigate(getDailyLogRoute(selectedDate));
    onClose();
  }, [navigate, onClose, selectedDate]);

  const dayInfoItems = useMemo<DayInfoItem[]>(() => {
    if (!dayData) return [];
    const items: DayInfoItem[] = [];

    if (dayData.isPeriodDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.periodDay"),
        dotClass: "day-info-dot--period",
      });
    } else if (dayData.isOvulationDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.ovulationDay"),
        dotClass: "day-info-dot--ovulation",
      });
    } else if (dayData.isFertileDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.fertileDay"),
        dotClass: "day-info-dot--fertile",
      });
    } else if (dayData.isPredictedDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.predictedDay"),
        dotClass: "day-info-dot--prediction",
      });
    }

    if (dayData.hasDailyLog) {
      items.push({
        label: t("_pages:home.calendarDayInfo.dailyLogRecorded"),
        dotClass: "day-info-dot--daily-log",
      });
    }

    return items;
  }, [dayData, t]);

  const actions = useMemo<ActionPropsType<BaseDto>[]>(
    () => [
      {
        id: "log-period",
        icon: <FontAwesomeIcon icon={faCalendarPlus} />,
        tooltip: t(
          `_pages:home.calendarDayActions.${dayData?.hasReportedPeriodInMonth ? "editPeriod" : "logPeriod"}`,
        ),
        onClick: handleLogPeriod,
        disabled: selectedDate === null,
      },
      {
        id: "log-daily-log",
        icon: <FontAwesomeIcon icon={faClipboardCheck} />,
        tooltip: t(
          `_pages:home.calendarDayActions.${dayData?.hasDailyLog ? "editDailyLog" : "dailyLog"}`,
        ),
        onClick: handleLogDailyLog,
        disabled: selectedDate === null,
      },
    ],
    [
      dayData?.hasDailyLog,
      dayData?.hasReportedPeriodInMonth,
      handleLogDailyLog,
      handleLogPeriod,
      selectedDate,
      t,
    ],
  );

  return (
    <AnimatedDropdown open={open} onClose={onClose} anchorEl={anchorEl}>
      {dayInfoItems.length > 0 && (
        <div className="day-info-section">
          {dayInfoItems.map((item) => (
            <div key={item.dotClass} className="day-info-row">
              <span className={`day-info-dot ${item.dotClass}`} />
              <span className="day-info-label">{item.label}</span>
            </div>
          ))}
        </div>
      )}
      <Actions
        actions={actions}
        showActionTexts
        showTooltips={false}
        className={CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES.list}
        itemClassName={CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES.item}
        actionClassName={CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES.action}
      />
    </AnimatedDropdown>
  );
}
