"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  category: string;
  audience: string;
  createdAt: string;
};

export default function AdminAnnouncementsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("ANNOUNCEMENT");
  const [audience, setAudience] = useState("ALL");

  async function loadNotifications() {
    const res = await fetch("/api/notifications");
    const data = await res.json();

    setNotifications(data.notifications || []);
  }

  async function sendAnnouncement() {
    if (!title.trim() || !message.trim()) return;

    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        message,
        category,
        audience,
      }),
    });

    setTitle("");
    setMessage("");
    await loadNotifications();
  }

  useEffect(() => {
    async function loadInitialNotifications() {
      await loadNotifications();
    }

    loadInitialNotifications();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-500 mt-2">
          Send placement updates, exam notices, holiday notices, and broadcasts.
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="border rounded-2xl px-4 py-3 w-full"
          />

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message"
            rows={6}
            className="border rounded-2xl px-4 py-3 w-full resize-none"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="border rounded-2xl px-4 py-3 w-full"
          >
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="PLACEMENT">Placement Update</option>
            <option value="EXAM">Exam Notice</option>
            <option value="HOLIDAY">Holiday Notice</option>
          </select>

          <select
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            className="border rounded-2xl px-4 py-3 w-full"
          >
            <option value="ALL">All</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
          </select>

          <button
            onClick={sendAnnouncement}
            className="bg-black text-white rounded-2xl px-5 py-3 w-full"
          >
            Send Announcement
          </button>
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Broadcasts
          </h2>

          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-gray-500 mt-2">{item.message}</p>
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 rounded-xl px-3 py-2">
                    {item.audience}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  {item.category} / {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
