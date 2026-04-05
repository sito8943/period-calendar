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
import { Dropdown, Actions } from "@sito/dashboard-app";
import { getDailyLogRoute, getPeriodLogRouteWithStartDate } from "lib";

// constants
import { CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES } from "./constants";

// types
import type { CalendarDayActionsDropdownProps } from "./types";

export function CalendarDayActionsDropdown({
  open,
  anchorEl,
  selectedDate,
  onClose,
}: CalendarDayActionsDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogPeriod = useCallback(() => {
    if (!selectedDate) return;
    navigate(getPeriodLogRouteWithStartDate(selectedDate));
    onClose();
  }, [navigate, onClose, selectedDate]);

  const handleLogDailyLog = useCallback(() => {
    if (!selectedDate) return;
    navigate(getDailyLogRoute(selectedDate));
    onClose();
  }, [navigate, onClose, selectedDate]);

  const actions = useMemo<ActionPropsType<BaseDto>[]>(
    () => [
      {
        id: "log-period",
        icon: <FontAwesomeIcon icon={faCalendarPlus} />,
        tooltip: t("_pages:home.calendarDayActions.logPeriod"),
        onClick: handleLogPeriod,
        disabled: selectedDate === null,
      },
      {
        id: "log-daily-log",
        icon: <FontAwesomeIcon icon={faClipboardCheck} />,
        tooltip: t("_pages:home.calendarDayActions.dailyLog"),
        onClick: handleLogDailyLog,
        disabled: selectedDate === null,
      },
    ],
    [handleLogDailyLog, handleLogPeriod, selectedDate, t],
  );

  return (
    <Dropdown open={open} onClose={onClose} anchorEl={anchorEl}>
      <Actions
        actions={actions}
        showActionTexts
        showTooltips={false}
        className={CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES.list}
        itemClassName={CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES.item}
        actionClassName={CALENDAR_DAY_ACTIONS_DROPDOWN_CLASSNAMES.action}
      />
    </Dropdown>
  );
}
