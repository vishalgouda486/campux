export default function FacultySwapsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Swap Requests</h1>
        <p className="text-gray-500 mt-2">
          Faculty timetable swap workflow is ready for future approval rules.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-gray-500">
        No pending swap requests.
      </div>
    </div>
  );
}
