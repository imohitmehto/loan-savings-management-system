"use client";
import { useState, useEffect, useCallback } from "react";

// Define your CalendarEvent type matching API
export interface CalendarEvent {
  id: string;
  title: string; // or appropriate field
  // add other fields as needed
}

// Event map structure with CalendarEvent array values
export interface CalendarEventMap {
  [date: string]: CalendarEvent[]; // e.g. "2025-07-21": [eventObj, eventObj]
}

interface UseCalendarEventsOptions {
  fetchEvents: () => Promise<CalendarEventMap>;
}

/**
 * Custom hook for calendar events
 */
export function useCalendarEvents({ fetchEvents }: UseCalendarEventsOptions) {
  const [events, setEvents] = useState<CalendarEventMap>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load events on mount
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

  // Return the events for a specific date or empty array
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
