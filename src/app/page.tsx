import Link from "next/link";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-bold">
            C
          </div>

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Campux
            </h1>

            <p className="text-sm text-gray-500">
              Smart College ERP
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <Link
            href="/login"
            className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Sign In
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-2xl bg-black text-white hover:opacity-90 transition"
          >
            Get Started
          </Link>

        </div>

      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>

            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium mb-6">

              Live College ERP Platform

            </div>

            <h1 className="text-6xl font-bold leading-tight text-gray-900">

              One Smart ERP

              <span className="block text-blue-600">
                For Entire Campus
              </span>

            </h1>

            <p className="text-xl text-gray-500 mt-8 leading-relaxed">

              Campux simplifies timetable management, attendance,
              notifications, marks, faculty coordination and
              academic workflows into one modern intelligent platform.

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/login"
                className="bg-black text-white px-8 py-4 rounded-2xl text-lg font-medium hover:opacity-90 transition"
              >
                Open Dashboard
              </Link>

              <Link
                href="/login"
                className="bg-white border border-gray-300 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-100 transition"
              >
                Sign In
              </Link>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 mt-14">

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

                <h2 className="text-4xl font-bold text-blue-600">
                  99%
                </h2>

                <p className="text-gray-500 mt-2">
                  Attendance Accuracy
                </p>

              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

                <h2 className="text-4xl font-bold text-green-600">
                  24/7
                </h2>

                <p className="text-gray-500 mt-2">
                  Live ERP Access
                </p>

              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

                <h2 className="text-4xl font-bold text-orange-500">
                  Real
                </h2>

                <p className="text-gray-500 mt-2">
                  Time Updates
                </p>

              </div>

            </div>

          </div>

          {/* Right */}
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl">

            <div className="bg-[#0f172a] rounded-[32px] p-8 text-white">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-3xl font-bold">
                    Weekly Timetable
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Live synchronized schedule
                  </p>

                </div>

                <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl">
                  LIVE
                </div>

              </div>

              <div className="space-y-4">

                <div className="bg-white/10 rounded-2xl p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-semibold">
                        Data Structures
                      </h3>

                      <p className="text-gray-400 mt-1">
                        Room 302
                      </p>

                    </div>

                    <div className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-medium">
                      9:00 AM
                    </div>

                  </div>

                </div>

                <div className="bg-white/10 rounded-2xl p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-semibold">
                        Operating Systems
                      </h3>

                      <p className="text-gray-400 mt-1">
                        Room 205
                      </p>

                    </div>

                    <div className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-medium">
                      11:00 AM
                    </div>

                  </div>

                </div>

                <div className="bg-white/10 rounded-2xl p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-semibold">
                        AI & ML
                      </h3>

                      <p className="text-gray-400 mt-1">
                        Lab 4
                      </p>

                    </div>

                    <div className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-medium">
                      2:00 PM
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 pb-24">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-gray-900">
            Everything Your Campus Needs
          </h2>

          <p className="text-xl text-gray-500 mt-5">
            Built for students, faculty and administrators.
          </p>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {[
            "Real-Time Timetable",
            "Attendance Tracking",
            "Internal Marks",
            "ERP Notifications",
          ].map((feature) => (

            <div
              key={feature}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition"
            >

              <div className="w-16 h-16 rounded-2xl bg-blue-100 mb-6"></div>

              <h3 className="text-2xl font-bold text-gray-900">
                {feature}
              </h3>

              <p className="text-gray-500 mt-4 leading-relaxed">

                Smart academic management system with
                modern real-time workflows.

              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}