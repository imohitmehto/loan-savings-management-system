"use client";
import { useState, useEffect, useCallback } from "react";

// Event map structure for easy lookup
export interface CalendarEventMap {
  [date: string]: string[]; // e.g. "2025-07-21": ["EMI Due", "Salary Deposit"]
}

interface UseCalendarEventsOptions {
  fetchEvents: () => Promise<CalendarEventMap>;
}

export function useCalendarEvents({ fetchEvents }: UseCalendarEventsOptions) {
  const [events, setEvents] = useState<CalendarEventMap>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events on hook mount
  useEffect(() => {
    setLoading(true);
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setError(null);
      })
      .catch(() => setError("Failed to load calendar events."))
      .finally(() => setLoading(false));
  }, [fetchEvents]);

  // Get list of events for a specific date
  const getEventsForDate = useCallback(
    (date: Date) => events[date.toISOString().split("T")[0]] || [],
    [events],
  );

  return {
    events,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    getEventsForDate,
    setEvents,
  };
}
