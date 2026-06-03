"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  category: string;
  createdAt: string;
};

export default function FacultyNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      const res = await fetch("/api/notifications?audience=FACULTY");
      const data = await res.json();

      setNotifications(data.notifications || []);
    }

    loadNotifications();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-2">
          Department updates for teaching faculty.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-gray-500 mt-2">{item.message}</p>
              </div>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl px-3 py-2">
                {item.category}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-gray-500">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}
