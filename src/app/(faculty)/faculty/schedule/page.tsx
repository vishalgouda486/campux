"use client";

import { useEffect, useState } from "react";

type TimetableEntry = {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  classroom: string;
  semester: number;
  subject: {
    name: string;
  };
  faculty: {
    email: string;
    name: string;
  };
};

export default function FacultySchedulePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimetableEntry | null>(null);
  
  const [faculties, setFaculties] = useState<any[]>([]);
  const [targetFacultyEmail, setTargetFacultyEmail] = useState("");
  const [targetSlots, setTargetSlots] = useState<TimetableEntry[]>([]);
  const [selectedTargetSlotId, setSelectedTargetSlotId] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const currentUserEmail = typeof window !== "undefined" ? localStorage.getItem("campux-email") || "" : "";

  useEffect(() => {
    async function loadSchedule() {
      const res = await fetch("/api/timetable");
      const data = await res.json();
      setEntries(
        (data.timetable || []).filter(
          (entry: TimetableEntry) => entry.faculty.email === currentUserEmail
        )
      );
    }

    if (currentUserEmail) {
      loadSchedule();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (isModalOpen) {
      async function fetchFaculties() {
        const res = await fetch("/api/faculty");
        const data = await res.json();
        if (data.success) {
          setFaculties(data.faculty.filter((f: any) => f.email !== currentUserEmail && f.isTeaching));
        }
      }
      fetchFaculties();
    }
  }, [isModalOpen, currentUserEmail]);

  useEffect(() => {
    if (targetFacultyEmail) {
      async function fetchTargetSlots() {
        setLoadingSlots(true);
        try {
          const res = await fetch("/api/timetable");
          const data = await res.json();
          setTargetSlots(
            (data.timetable || []).filter(
              (entry: TimetableEntry) => entry.faculty.email === targetFacultyEmail
            )
          );
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingSlots(false);
        }
      }
      fetchTargetSlots();
    } else {
      setTargetSlots([]);
    }
  }, [targetFacultyEmail]);

  const handleOpenSwapModal = (slot: TimetableEntry) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
    setTargetFacultyEmail("");
    setTargetSlots([]);
    setSelectedTargetSlotId("");
    setMessage("");
    setSuccess(false);
  };

  const handleCloseSwapModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleSendSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !targetFacultyEmail || !selectedTargetSlotId) {
      setMessage("Please fill all fields.");
      setSuccess(false);
      return;
    }

    try {
      const res = await fetch("/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterEmail: currentUserEmail,
          requesterSlotId: selectedSlot.id,
          targetFacultyEmail,
          targetSlotId: selectedTargetSlotId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setMessage("Swap request sent successfully!");
        setTimeout(() => {
          handleCloseSwapModal();
        }, 1500);
      } else {
        setSuccess(false);
        setMessage(data.message || "Failed to send swap request.");
      }
    } catch (err: any) {
      setSuccess(false);
      setMessage(err.message || "An error occurred.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-500 mt-2">
          Assigned timetable slots from the smart generator.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[120px_120px_1.4fr_100px_120px_140px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 items-center">
          <div>Day</div>
          <div>Time</div>
          <div>Subject</div>
          <div>Semester</div>
          <div>Room</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[120px_120px_1.4fr_100px_120px_140px] gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
            >
              <div className="font-semibold text-gray-800">{entry.day}</div>
              <div className="text-gray-600">
                {entry.startTime} - {entry.endTime}
              </div>
              <div className="font-medium text-gray-950">{entry.subject.name}</div>
              <div className="text-gray-600">Sem {entry.semester}</div>
              <div className="text-gray-600">{entry.classroom}</div>
              <div className="text-right">
                <button
                  onClick={() => handleOpenSwapModal(entry)}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-2xl text-xs font-semibold transition"
                >
                  Request Swap
                </button>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="px-6 py-10 text-gray-500 text-center">
              No timetable slots assigned yet.
            </div>
          )}
        </div>
      </div>

      {/* Request Swap Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Request Timetable Swap</h2>
              <button
                onClick={handleCloseSwapModal}
                className="text-gray-400 hover:text-gray-600 font-semibold text-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSendSwapRequest} className="p-6 space-y-6">
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Your Selected Slot</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-900">{selectedSlot.subject.name}</span>
                  <span className="text-gray-500">Sem {selectedSlot.semester}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedSlot.day} • {selectedSlot.startTime} - {selectedSlot.endTime} • {selectedSlot.classroom}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Select Faculty to Swap With</label>
                <select
                  value={targetFacultyEmail}
                  onChange={(e) => setTargetFacultyEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">-- Choose Faculty --</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.email}>
                      {f.name} ({f.department})
                    </option>
                  ))}
                </select>
              </div>

              {targetFacultyEmail && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Select Target Timetable Slot</label>
                  {loadingSlots ? (
                    <p className="text-xs text-gray-500 animate-pulse">Loading slots...</p>
                  ) : targetSlots.length === 0 ? (
                    <p className="text-xs text-red-500">No scheduled slots found for this faculty member.</p>
                  ) : (
                    <select
                      value={selectedTargetSlotId}
                      onChange={(e) => setSelectedTargetSlotId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">-- Choose Slot --</option>
                      {targetSlots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.day} ({s.startTime}-{s.endTime}) - {s.subject.name} (Sem {s.semester})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {message && (
                <p className={`text-sm text-center font-medium ${success ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseSwapModal}
                  className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedTargetSlotId}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-50"
                >
                  Send Swap Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
