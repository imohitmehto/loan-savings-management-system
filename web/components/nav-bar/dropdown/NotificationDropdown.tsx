'use client';

import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) throw new Error('Network error');

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        // Fallback dummy data
        setNotifications([
          { id: 1, message: 'Dummy: Welcome to the dashboard!', read: false },
          {
            id: 2,
            message: 'Dummy: Your loan request is under review.',
            read: false,
          },
          { id: 3, message: 'Dummy: New savings policy added.', read: true },
        ]);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-md w-64 rounded-md z-50">
      <div className="p-3 border-b text-sm font-semibold">Notifications</div>
      <ul className="text-sm max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(note => (
            <li
              key={note.id}
              className={`px-4 py-2 border-b last:border-none hover:bg-gray-100 ${
                !note.read ? 'font-medium' : 'text-gray-500'
              }`}
            >
              {note.message}
            </li>
          ))
        ) : (
          <li className="px-4 py-2 text-gray-500">No notifications</li>
        )}
      </ul>
    </div>
  );
}
