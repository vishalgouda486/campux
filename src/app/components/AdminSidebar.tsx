"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Bell,
  ClipboardList,
  GraduationCap,
  BookOpen,
  PlusCircle,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    name: "Add Student",
    href: "/admin/students/add",
    icon: PlusCircle,
  },
  {
    name: "Faculty",
    href: "/admin/faculty",
    icon: Users,
  },
  {
    name: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    name: "Add Subject",
    href: "/admin/subjects/add",
    icon: PlusCircle,
  },
  {
    name: "Time Table",
    href: "/admin/timetable",
    icon: CalendarDays,
  },
  {
    name: "Marks",
    href: "/admin/marks",
    icon: GraduationCap,
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    icon: Bell,
  },
  {
    name: "Attendance",
    href: "/admin/attendance",
    icon: ClipboardList,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [name, setName] = useState("System Administrator");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const email = localStorage.getItem("campux-email");
        if (!email) return;
        const res = await fetch(`/api/profile?email=${email}`);
        const data = await res.json();
        if (data.success && data.user?.name) {
          setName(data.user.name);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-5 hidden md:flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl">
              C
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campux</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Profile */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-4 mt-6">
        <h3 className="font-semibold text-gray-900 truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Full Access Enabled
        </p>
      </div>
    </aside>
  );
}
