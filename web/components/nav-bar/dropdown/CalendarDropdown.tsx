"use client";

import React, { useCallback } from "react";
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import { useState } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { fetchCalendarEventsAdmin } from "@/lib/api/calendar";

export default function CalendarDropdown() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {
    events,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    getEventsForDate,
  } = useCalendarEvents({
    fetchEvents: fetchCalendarEventsAdmin,
  });

  // Calendar grid always renders
  const renderCalendar = useCallback(() => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    let day = startDate;
    const rows = [];
    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = format(day, "yyyy-MM-dd");
        // Show markers only if data loaded, else render grid blank
        const hasEvents = !loading && !!events[dateStr];
        const isCurrent = isSameMonth(day, currentMonth);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentDay = isToday(day);
        days.push(
          <div
            key={day.toISOString()}
            onClick={() => isCurrent && setSelectedDate(day)}
            className={[
              "flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all select-none",
              isSelected
                ? "bg-blue-500 text-white"
                : hasEvents
                  ? "bg-yellow-100"
                  : isCurrentDay
                    ? "border-2 border-blue-400"
                    : "bg-white",
              isCurrent ? "text-gray-800" : "text-gray-300",
              "hover:ring-2 hover:ring-blue-400",
            ].join(" ")}
          >
            <span className="text-sm">{format(day, "d")}</span>
            {hasEvents && (
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1"></span>
            )}
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={week} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      );
    }
    return <div className="space-y-1">{rows}</div>;
  }, [currentMonth, selectedDate, setSelectedDate, events, loading]);

  return (
    <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-xl w-96 rounded-xl z-50 p-4">
      {/* Header and days-of-week unchanged */}
      {renderCalendar()}
      {/* Event details or status only below */}
      {selectedDate && (
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-semibold mb-1">
            Events on {format(selectedDate, "dd MMM yyyy")}
          </h4>
          {loading ? (
            <div className="text-gray-500 py-2">Loading events...</div>
          ) : error ? (
            <div className="text-red-500 py-2">{error}</div>
          ) : (
            <ul className="text-sm list-disc list-inside space-y-1">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event, i) => (
                  <li key={i}>{event}</li>
                ))
              ) : (
                <li className="text-gray-400">No events</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
