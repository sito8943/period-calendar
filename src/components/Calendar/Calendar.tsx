import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// lib
import { getMonthDays, isSameDay, isDateInPeriod } from "lib";
import type { Period } from "lib";

// components
import { CalendarDay } from "./CalendarDay";
import type { CalendarDayData } from "./types";

type CalendarProps = {
  periods: Period[];
  predictedStart: Date | null;
  predictedEnd: Date | null;
};

const WEEKDAYS_ES = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekdays(locale: string) {
  return locale.startsWith("es") ? WEEKDAYS_ES : WEEKDAYS_EN;
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  return d >= s && d <= e;
}

export function Calendar({ periods, predictedStart, predictedEnd }: CalendarProps) {
  const { i18n } = useTranslation();
  const today = useMemo(() => new Date(), []);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const weekdays = getWeekdays(i18n.language);

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    i18n.language,
    { month: "long", year: "numeric" },
  );

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const calendarDays = useMemo<CalendarDayData[]>(() => {
    const days = getMonthDays(currentYear, currentMonth);

    // pad start with previous month days
    const firstDayOfWeek = days[0].getDay();
    // Convert Sunday=0 to Monday-based: Mon=0, Tue=1, ..., Sun=6
    const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const paddedDays: CalendarDayData[] = [];

    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth, -i);
      paddedDays.push({
        date: d,
        isCurrentMonth: false,
        isToday: false,
        isPeriodDay: false,
        isPredictedDay: false,
      });
    }

    // Current month days
    for (const date of days) {
      const isPeriodDay = periods.some((p) => isDateInPeriod(date, p));
      const isPredictedDay =
        !isPeriodDay &&
        predictedStart !== null &&
        predictedEnd !== null &&
        isDateInRange(date, predictedStart, predictedEnd);

      paddedDays.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        isPeriodDay,
        isPredictedDay,
      });
    }

    // Next month padding to complete the grid (fill to 42 or nearest row of 7)
    const remainder = paddedDays.length % 7;
    if (remainder > 0) {
      const nextMonthDays = 7 - remainder;
      for (let i = 1; i <= nextMonthDays; i++) {
        const d = new Date(currentYear, currentMonth + 1, i);
        paddedDays.push({
          date: d,
          isCurrentMonth: false,
          isToday: false,
          isPeriodDay: false,
          isPredictedDay: false,
        });
      }
    }

    return paddedDays;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- today is stable for the component's lifetime
  }, [currentYear, currentMonth, periods, predictedStart, predictedEnd]);

  return (
    <div className="bg-base-light rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-base-dark transition-colors"
          aria-label="Previous month"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-text-muted" />
        </button>
        <h2 className="text-lg font-semibold capitalize text-text">
          {monthName}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-base-dark transition-colors"
          aria-label="Next month"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-text-muted" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-text-muted"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div key={index} className="flex items-center justify-center">
            <CalendarDay day={day} />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          <span>Periodo</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-secondary opacity-60 inline-block" />
          <span>Prediccion</span>
        </div>
      </div>
    </div>
  );
}
