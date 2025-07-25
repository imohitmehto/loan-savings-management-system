import { CalendarEvent } from "@/lib/hooks/useCalendarEvents";

interface EventListProps {
  date: string;
  events: CalendarEvent[];
}

export default function EventList({ date, events }: EventListProps) {
  const filtered = events.filter((e) => e.date === date);

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Events on {date}</h4>
      {filtered.length > 0 ? (
        <ul className="space-y-1 text-sm text-gray-800">
          {filtered.map((e) => (
            <li key={e.id} className="px-3 py-1 bg-gray-100 rounded">{e.title}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No events.</p>
      )}
    </div>
  );
}
