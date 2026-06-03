"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Percent,
  Users,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Analytics = {
  stats: {
    totalStudents: number;
    totalFaculty: number;
    totalSubjects: number;
    attendancePercentage: number;
    passPercentage: number;
  };
  semesterDistribution: Array<{
    semester: number;
    count: number;
  }>;
  subjectDistribution: Array<{
    semester: number;
    count: number;
  }>;
  workload: Array<{
    faculty: string;
    day: string;
    totalClasses: number;
  }>;
};

const emptyAnalytics: Analytics = {
  stats: {
    totalStudents: 0,
    totalFaculty: 0,
    totalSubjects: 0,
    attendancePercentage: 0,
    passPercentage: 0,
  },
  semesterDistribution: [],
  subjectDistribution: [],
  workload: [],
};

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics>(emptyAnalytics);

  useEffect(() => {
    async function loadAnalytics() {
      const res = await fetch("/api/analytics");
      const data = await res.json();

      if (data.success) {
        setAnalytics(data);
      }
    }

    loadAnalytics();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: analytics.stats.totalStudents,
      icon: GraduationCap,
    },
    {
      title: "Teaching Faculty",
      value: analytics.stats.totalFaculty,
      icon: Users,
    },
    {
      title: "Subjects",
      value: analytics.stats.totalSubjects,
      icon: BookOpen,
    },
    {
      title: "Attendance",
      value: `${analytics.stats.attendancePercentage}%`,
      icon: Percent,
    },
  ];
  const maxSemesterCount = Math.max(
    1,
    ...analytics.semesterDistribution.map((item) => item.count)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Live ERP overview for BCA academics, attendance, and workload.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-500">{stat.title}</p>
                <div className="h-10 w-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                  <Icon size={18} />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">{stat.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Semester Distribution
              </h2>
              <p className="text-gray-500">
                Student strength across BCA semesters.
              </p>
            </div>
          </div>

          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={analytics.semesterDistribution.map((d) => ({
                  name: `Sem ${d.semester}`,
                  students: d.count,
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Faculty Workload
          </h2>
          <div className="space-y-4">
            {analytics.workload.map((item) => (
              <div
                key={`${item.faculty}-${item.day}`}
                className="border border-gray-100 rounded-2xl p-4"
              >
                <p className="font-semibold text-gray-900">{item.faculty}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {item.day} / {item.totalClasses} classes
                </p>
              </div>
            ))}
            {analytics.workload.length === 0 && (
              <p className="text-gray-500">Generate a timetable to see workload.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
