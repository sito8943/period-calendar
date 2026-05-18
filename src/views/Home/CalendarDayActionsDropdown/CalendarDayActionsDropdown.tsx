import { useCallback, useEffect, useMemo, useState } from "react";
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
import type { CalendarDayData } from "components";
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
  const [persistedSelection, setPersistedSelection] = useState<{
    selectedDate: string | null;
    dayData: CalendarDayData | null;
  }>({
    selectedDate,
    dayData,
  });

  useEffect(() => {
    if (selectedDate === null) return;

    setPersistedSelection({
      selectedDate,
      dayData,
    });
  }, [dayData, selectedDate]);

  const resolvedSelectedDate = selectedDate ?? persistedSelection.selectedDate;
  const resolvedDayData = dayData ?? persistedSelection.dayData;

  const handleLogPeriod = useCallback(() => {
    if (!resolvedSelectedDate) return;
    if (resolvedDayData?.periodId)
      navigate(getPeriodLogDetailRoute(resolvedDayData.periodId));
    else navigate(getPeriodLogRouteWithStartDate(resolvedSelectedDate));
    onClose();
  }, [navigate, onClose, resolvedDayData?.periodId, resolvedSelectedDate]);

  const handleLogDailyLog = useCallback(() => {
    if (!resolvedSelectedDate) return;
    navigate(getDailyLogRoute(resolvedSelectedDate));
    onClose();
  }, [navigate, onClose, resolvedSelectedDate]);

  const dayInfoItems = useMemo<DayInfoItem[]>(() => {
    if (!resolvedDayData) return [];
    const items: DayInfoItem[] = [];

    if (resolvedDayData.isPeriodDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.periodDay"),
        dotClass: "day-info-dot--period",
      });
    } else if (resolvedDayData.isOvulationDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.ovulationDay"),
        dotClass: "day-info-dot--ovulation",
      });
    } else if (resolvedDayData.isFertileDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.fertileDay"),
        dotClass: "day-info-dot--fertile",
      });
    } else if (resolvedDayData.isPredictedDay) {
      items.push({
        label: t("_pages:home.calendarDayInfo.predictedDay"),
        dotClass: "day-info-dot--prediction",
      });
    }

    if (resolvedDayData.hasDailyLog) {
      items.push({
        label: t("_pages:home.calendarDayInfo.dailyLogRecorded"),
        dotClass: "day-info-dot--daily-log",
      });
    }

    return items;
  }, [resolvedDayData, t]);

  const actions = useMemo<ActionPropsType<BaseDto>[]>(
    () => [
      {
        id: "log-period",
        icon: <FontAwesomeIcon icon={faCalendarPlus} />,
        tooltip: t(
          `_pages:home.calendarDayActions.${resolvedDayData?.hasReportedPeriodInMonth ? "editPeriod" : "logPeriod"}`,
        ),
        onClick: handleLogPeriod,
        disabled: resolvedSelectedDate === null,
      },
      {
        id: "log-daily-log",
        icon: <FontAwesomeIcon icon={faClipboardCheck} />,
        tooltip: t(
          `_pages:home.calendarDayActions.${resolvedDayData?.hasDailyLog ? "editDailyLog" : "dailyLog"}`,
        ),
        onClick: handleLogDailyLog,
        disabled: resolvedSelectedDate === null,
      },
    ],
    [
      handleLogDailyLog,
      handleLogPeriod,
      resolvedDayData?.hasDailyLog,
      resolvedDayData?.hasReportedPeriodInMonth,
      resolvedSelectedDate,
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
