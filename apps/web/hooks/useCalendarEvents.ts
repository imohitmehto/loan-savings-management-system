"use client";

import { useState } from "react";

export interface CalendarEventMap {
  [date: string]: string[]; // e.g. "2025-07-21": ["Meeting", "Reminder"]
}

export function useCalendarEvents(initialEvents?: CalendarEventMap) {
  const [events, setEvents] = useState<CalendarEventMap>(initialEvents || {});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getEventsForDate = (date: Date) => {
    return events[date.toISOString().split("T")[0]] || [];
  };

  return {
    events,
    selectedDate,
    setSelectedDate,
    setEvents,
    getEventsForDate,
  };
}
