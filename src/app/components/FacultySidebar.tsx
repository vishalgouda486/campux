"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Bell,
  ClipboardCheck,
  ArrowLeftRight,
  BookOpen,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/faculty",
    icon: LayoutDashboard,
  },
  {
    name: "Attendance",
    href: "/faculty/attendance",
    icon: ClipboardCheck,
  },
  {
    name: "Marks Upload",
    href: "/faculty/marks",
    icon: BookOpen,
  },
  {
    name: "Swap Requests",
    href: "/faculty/swaps",
    icon: ArrowLeftRight,
  },
  {
    name: "Notifications",
    href: "/faculty/notifications",
    icon: Bell,
  },
  {
    name: "Schedule",
    href: "/faculty/schedule",
    icon: CalendarDays,
  },
];

export default function FacultySidebar() {

  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-5 hidden md:flex flex-col justify-between">

      <div>

        {/* Logo */}
        <div className="mb-10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              C
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Campux
              </h1>

              <p className="text-sm text-gray-500">
                Faculty Portal
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
                      ? "bg-blue-600 text-white"
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
          Faculty Access
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Teaching Panel Enabled
        </p>

      </div>

    </aside>
  );
}