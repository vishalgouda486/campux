"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Bell,
  ClipboardCheck,
  GraduationCap,
  Megaphone,
  Menu,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  {
    name: "Time Table",
    href: "/student",
    icon: CalendarDays,
  },
  {
    name: "Attendance",
    href: "/student/attendance",
    icon: ClipboardCheck,
  },
  {
    name: "Results",
    href: "/student/results",
    icon: GraduationCap,
  },
  {
    name: "Announcements",
    href: "/student/announcements",
    icon: Megaphone,
  },
  {
    name: "Notifications",
    href: "/student/notifications",
    icon: Bell,
  },
];

function SidebarContent(pathname: string) {
  return (
    <div className="flex flex-col justify-between h-full">

      <div>

        {/* Logo */}
        <div className="mb-10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              C
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Campux
              </h1>

              <p className="text-gray-500 text-sm">
                Student Portal
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
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-4 mt-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            V
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold">
              Vishalgouda
            </h3>

            <p className="text-gray-500 text-sm">
              CSE Student
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-5 hidden md:flex flex-col">

        {SidebarContent(pathname)}

      </aside>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
            C
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              Campux
            </h1>

            <p className="text-xs text-gray-500">
              ERP Portal
            </p>
          </div>

        </div>

        <Sheet>

          <SheetTrigger asChild>

            <button className="p-2 rounded-xl border border-gray-200 bg-white">
              <Menu className="text-gray-700" />
            </button>

          </SheetTrigger>

          <SheetContent side="left" className="w-72 bg-white">

            {SidebarContent(pathname)}

          </SheetContent>

        </Sheet>

      </div>
    </>
  );
}