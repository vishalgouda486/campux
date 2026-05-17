export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1120] text-white flex">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#111827] border-r border-white/10 p-6 hidden md:flex flex-col">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-wide">
            Campux
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Smart College ERP
          </p>
        </div>

        <nav className="flex flex-col gap-3">

          <button className="bg-cyan-500 text-black font-semibold rounded-xl px-4 py-3 text-left transition hover:scale-[1.02]">
            Time Table
          </button>

          <button className="bg-white/5 hover:bg-white/10 rounded-xl px-4 py-3 text-left transition">
            Attendance
          </button>

          <button className="bg-white/5 hover:bg-white/10 rounded-xl px-4 py-3 text-left transition">
            Marks & Results
          </button>

          <button className="bg-white/5 hover:bg-white/10 rounded-xl px-4 py-3 text-left transition">
            Announcements
          </button>

          <button className="bg-white/5 hover:bg-white/10 rounded-xl px-4 py-3 text-left transition">
            Notifications
          </button>

        </nav>

      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-10">

        {/* Topbar */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              Welcome Back 👋
            </h2>

            <p className="text-gray-400 mt-1">
              Student Dashboard
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
            Vishalgouda Patil
          </div>

        </div>

        {/* Timetable Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-2xl font-semibold">
              Weekly Time Table
            </h3>

            <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl text-sm">
              Live Updated
            </div>

          </div>

          <div className="grid md:grid-cols-5 gap-4">

            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              
              <div
                key={day}
                className="bg-[#111827] rounded-2xl p-4 border border-white/10"
              >
                <h4 className="font-semibold text-lg mb-4">
                  {day}
                </h4>

                <div className="space-y-3">

                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="font-medium">
                      Data Structures
                    </p>

                    <p className="text-sm text-gray-400">
                      9:00 AM - 10:00 AM
                    </p>

                    <p className="text-sm text-cyan-400">
                      Room 302
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="font-medium">
                      Operating Systems
                    </p>

                    <p className="text-sm text-gray-400">
                      11:00 AM - 12:00 PM
                    </p>

                    <p className="text-sm text-cyan-400">
                      Room 205
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}