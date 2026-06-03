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

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("ANNOUNCEMENT");
  const [audience, setAudience] = useState("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadNotifications() {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data.notifications || []);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !message) return;

    setIsSubmitting(true);
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        message,
        category,
        audience,
        createdBy: localStorage.getItem("campux-email") || "Admin",
      }),
    });

    if (res.ok) {
      setTitle("");
      setMessage("");
      setCategory("ANNOUNCEMENT");
      setAudience("ALL");
      await loadNotifications();
    }
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-2">Publish announcements, notices, and alerts to students and faculty.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">New Notification</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-2"
                placeholder="E.g., Tomorrow is a holiday"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-2 h-32 resize-none"
                placeholder="Notification details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 bg-white"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="EXAM">Exam Notice</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="PLACEMENT">Placement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 bg-white"
                >
                  <option value="ALL">All Users</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="FACULTY">Faculty Only</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !title || !message}
              className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold disabled:opacity-60 mt-4"
            >
              {isSubmitting ? "Publishing..." : "Publish Notification"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Notifications</h2>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {notification.category}
                  </span>
                </div>
                <p className="text-gray-600">{notification.message}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-sm text-gray-500">Audience: {notification.audience}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-gray-500 bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm">
                No notifications published yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
