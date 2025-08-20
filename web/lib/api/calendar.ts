"use client";

import api from "@/lib/api/axiosInstance";
import { safeApiCall, ApiError, apiLog } from "@/lib/api/helpers/apiHelpers";

// ------------------- Calendar API -------------------

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
}
export type CalendarEventMap = Record<string, CalendarEvent[]>;

/**
 * Fetch all calendar events for admin users.
 */
export const fetchCalendarEventsAdmin = (): Promise<CalendarEventMap> =>
  safeApiCall(async () => {
    apiLog("Fetching admin calendar events...");
    const { data } = await api.get<CalendarEventMap>(
      "/api/admin/calendar-events",
    );

    if (!data || typeof data !== "object") {
      throw new ApiError("Invalid data format received from API", 500);
    }

    return data;
  });
