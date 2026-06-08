"use client";

import { useEffect, useState } from "react";

type SlotDetail = {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  semester: number;
  classroom: string;
  facultyName: string;
};

type SwapRequest = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  requesterEmail: string;
  targetFacultyEmail: string;
  requesterSlot: SlotDetail | null;
  targetSlot: SlotDetail | null;
};

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

export default function FacultySwapsPage() {
  const [receivedSwaps, setReceivedSwaps] = useState<SwapRequest[]>([]);
  const [sentSwaps, setSentSwaps] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  // New Swap Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mySlots, setMySlots] = useState<TimetableEntry[]>([]);
  const [selectedMySlotId, setSelectedMySlotId] = useState("");
  const [faculties, setFaculties] = useState<any[]>([]);
  const [targetFacultyEmail, setTargetFacultyEmail] = useState("");
  const [targetSlots, setTargetSlots] = useState<TimetableEntry[]>([]);
  const [selectedTargetSlotId, setSelectedTargetSlotId] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const currentUserEmail = typeof window !== "undefined" ? localStorage.getItem("campux-email") || "" : "";

  async function loadSwaps() {
    if (!currentUserEmail) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/swaps?email=${currentUserEmail}`);
      const data = await res.json();
      if (data.success) {
        setReceivedSwaps(data.received || []);
        setSentSwaps(data.sent || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSwaps();
  }, [currentUserEmail]);

  // Load My Slots and Other Faculties when modal is opened
  useEffect(() => {
    if (isModalOpen && currentUserEmail) {
      async function loadModalData() {
        try {
          const resTimetable = await fetch("/api/timetable");
          const dataTimetable = await resTimetable.json();
          const filteredMySlots = (dataTimetable.timetable || []).filter(
            (entry: TimetableEntry) => entry.faculty.email === currentUserEmail
          );
          setMySlots(filteredMySlots);

          const resFaculties = await fetch("/api/faculty");
          const dataFaculties = await resFaculties.json();
          if (dataFaculties.success) {
            setFaculties(dataFaculties.faculty.filter((f: any) => f.email !== currentUserEmail && f.isTeaching));
          }
        } catch (err) {
          console.error(err);
        }
      }
      loadModalData();
    }
  }, [isModalOpen, currentUserEmail]);

  // Load Target Slots when target faculty is selected
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

  const handleRespond = async (swapRequestId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/swaps/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swapRequestId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setMessage(`Swap request ${action.toLowerCase()}d successfully!`);
        loadSwaps();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setSuccess(false);
        setMessage(data.message || "Failed to update swap request.");
      }
    } catch (err: any) {
      setSuccess(false);
      setMessage(err.message || "An error occurred.");
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedMySlotId("");
    setTargetFacultyEmail("");
    setTargetSlots([]);
    setSelectedTargetSlotId("");
    setModalMessage("");
    setModalSuccess(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMySlotId || !targetFacultyEmail || !selectedTargetSlotId) {
      setModalMessage("Please fill in all fields.");
      setModalSuccess(false);
      return;
    }

    try {
      const res = await fetch("/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterEmail: currentUserEmail,
          requesterSlotId: selectedMySlotId,
          targetFacultyEmail,
          targetSlotId: selectedTargetSlotId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalSuccess(true);
        setModalMessage("Swap request sent successfully!");
        loadSwaps();
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setModalSuccess(false);
        setModalMessage(data.message || "Failed to send swap request.");
      }
    } catch (err: any) {
      setModalSuccess(false);
      setModalMessage(err.message || "An error occurred.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">Approved</span>;
      case "REJECTED":
        return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold animate-pulse">Pending</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 font-sans tracking-tight">Timetable Swap Requests</h1>
          <p className="text-gray-500 mt-2">
            Review and approve peer timetable swap proposals or check your sent requests.
          </p>
        </div>
        <div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition shadow-sm flex items-center gap-2"
          >
            <span className="text-lg">+</span> Send Swap Request
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-medium border ${success ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-px">
        <button
          onClick={() => setActiveTab("received")}
          className={`pb-4 px-2 font-semibold text-sm border-b-2 transition ${
            activeTab === "received"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Received Requests ({receivedSwaps.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`pb-4 px-2 font-semibold text-sm border-b-2 transition ${
            activeTab === "sent"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Sent Requests ({sentSwaps.length})
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-10 text-center animate-pulse">Loading requests...</div>
      ) : activeTab === "received" ? (
        <div className="space-y-4">
          {receivedSwaps.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-gray-500 text-center">
              No received swap requests.
            </div>
          ) : (
            receivedSwaps.map((swap) => (
              <div
                key={swap.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition duration-300"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{swap.requesterSlot?.facultyName}</span>
                    <span className="text-gray-400 text-sm">wants to swap slots:</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Requester Slot */}
                    <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Their Proposed Slot</p>
                      {swap.requesterSlot ? (
                        <>
                          <p className="font-bold text-gray-950 text-sm">{swap.requesterSlot.subjectName}</p>
                          <p className="text-xs text-gray-500 mt-1">Sem {swap.requesterSlot.semester} • {swap.requesterSlot.classroom}</p>
                          <p className="text-xs text-gray-600 mt-1 font-semibold">{swap.requesterSlot.day} • {swap.requesterSlot.startTime} - {swap.requesterSlot.endTime}</p>
                        </>
                      ) : (
                        <p className="text-xs text-red-500">Slot details unavailable</p>
                      )}
                    </div>

                    {/* Target Slot */}
                    <div className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Affected Slot</p>
                      {swap.targetSlot ? (
                        <>
                          <p className="font-bold text-gray-950 text-sm">{swap.targetSlot.subjectName}</p>
                          <p className="text-xs text-gray-500 mt-1">Sem {swap.targetSlot.semester} • {swap.targetSlot.classroom}</p>
                          <p className="text-xs text-gray-600 mt-1 font-semibold">{swap.targetSlot.day} • {swap.targetSlot.startTime} - {swap.targetSlot.endTime}</p>
                        </>
                      ) : (
                        <p className="text-xs text-red-500">Slot details unavailable</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 justify-center">
                  <div className="text-xs text-gray-400">
                    Requested: {new Date(swap.createdAt).toLocaleDateString()}
                  </div>
                  {swap.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(swap.id, "REJECT")}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-2xl text-xs font-bold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleRespond(swap.id, "APPROVE")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <div>{getStatusBadge(swap.status)}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sentSwaps.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-gray-500 text-center">
              No sent swap requests.
            </div>
          ) : (
            sentSwaps.map((swap) => (
              <div
                key={swap.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition duration-300"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">You proposed a swap with</span>
                    <span className="font-bold text-gray-900">{swap.targetSlot?.facultyName}</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Requester Slot */}
                    <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Your Proposed Slot</p>
                      {swap.requesterSlot ? (
                        <>
                          <p className="font-bold text-gray-950 text-sm">{swap.requesterSlot.subjectName}</p>
                          <p className="text-xs text-gray-500 mt-1">Sem {swap.requesterSlot.semester} • {swap.requesterSlot.classroom}</p>
                          <p className="text-xs text-gray-600 mt-1 font-semibold">{swap.requesterSlot.day} • {swap.requesterSlot.startTime} - {swap.requesterSlot.endTime}</p>
                        </>
                      ) : (
                        <p className="text-xs text-red-500">Slot details unavailable</p>
                      )}
                    </div>

                    {/* Target Slot */}
                    <div className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-medium">Their Requested Slot</p>
                      {swap.targetSlot ? (
                        <>
                          <p className="font-bold text-gray-950 text-sm">{swap.targetSlot.subjectName}</p>
                          <p className="text-xs text-gray-500 mt-1">Sem {swap.targetSlot.semester} • {swap.targetSlot.classroom}</p>
                          <p className="text-xs text-gray-600 mt-1 font-semibold">{swap.targetSlot.day} • {swap.targetSlot.startTime} - {swap.targetSlot.endTime}</p>
                        </>
                      ) : (
                        <p className="text-xs text-red-500">Slot details unavailable</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 justify-center">
                  <div className="text-xs text-gray-400">
                    Requested: {new Date(swap.createdAt).toLocaleDateString()}
                  </div>
                  <div>{getStatusBadge(swap.status)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Send Swap Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Send Swap Request</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 font-semibold text-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateSwapRequest} className="p-6 space-y-6">
              {/* Select My Slot */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Select Your Affected Slot</label>
                <select
                  value={selectedMySlotId}
                  onChange={(e) => setSelectedMySlotId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">-- Choose Your Slot --</option>
                  {mySlots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.day} ({s.startTime}-{s.endTime}) - {s.subject.name} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Target Faculty */}
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

              {/* Select Target Slot */}
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

              {modalMessage && (
                <p className={`text-sm text-center font-medium ${modalSuccess ? "text-green-600" : "text-red-600"}`}>
                  {modalMessage}
                </p>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedMySlotId || !selectedTargetSlotId}
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
