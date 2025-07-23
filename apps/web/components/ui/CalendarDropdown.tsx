"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { useState } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

export default function CalendarDropdown() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {
    events,
    selectedDate,
    setSelectedDate,
    getEventsForDate,
  } = useCalendarEvents({
    "2025-07-20": ["Loan disbursal - User A", "Account review"],
    "2025-07-25": ["Staff meeting", "Monthly savings deadline"],
  });

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const rows = [];
    let days = [];
    let day = startDate;

    for (let i = 0; i < 6; i++) {
      days = [];
      for (let j = 0; j < 7; j++) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const hasEvents = events[formattedDate];
        const isCurrentMonth = isSameMonth(day, currentMonth);
        days.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(day)}
            className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all ${
              isSameDay(day, selectedDate) ? "bg-blue-500 text-white" : hasEvents ? "bg-yellow-100" : "bg-white"
            } ${!isCurrentMonth ? "text-gray-300" : "text-gray-800"} hover:ring-2 hover:ring-blue-400`}
          >
            <span className="text-sm">{format(day, "d")}</span>
            {hasEvents && (
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1"></span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={i} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-xl w-96 rounded-xl z-50 p-4">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-gray-600 hover:text-blue-500"
        >
          ‹
        </button>
        <span className="font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-600 hover:text-blue-500"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-xs text-center font-semibold text-gray-500 mb-1">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      {renderCalendar()}

      {selectedDate && (
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-semibold mb-1">
            Events on {format(selectedDate, "dd MMM yyyy")}
          </h4>
          <ul className="text-sm list-disc list-inside space-y-1">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event, i) => (
                <li key={i}>{event}</li>
              ))
            ) : (
              <li className="text-gray-400">No events</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
