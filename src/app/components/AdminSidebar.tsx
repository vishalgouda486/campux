"use client";

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

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-5 hidden md:flex flex-col justify-between">

      <div>

        {/* Logo */}
        <div className="mb-10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl">
              C
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Campux
              </h1>

              <p className="text-sm text-gray-500">
                Admin Panel
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2">

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

                <span className="font-medium">
                  {link.name}
                </span>

              </Link>
            );
          })}

        </div>

      </div>

      {/* Profile */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-4">

        <h3 className="font-semibold text-gray-900">
          System Administrator
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Full Access Enabled
        </p>

      </div>

    </aside>
  );
}
