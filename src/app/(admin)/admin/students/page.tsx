"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  department: string;
  semester: number;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [semester, setSemester] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);

  async function loadStudents(nextSemester = semester) {
    const params = new URLSearchParams();
    if (nextSemester) params.set("semester", nextSemester);

    const res = await fetch(`/api/student/list?${params.toString()}`);
    const data = await res.json();
    setStudents(data.students || []);
  }

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setUploadMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setParsedData(parsed);
      } catch (err: any) {
        setUploadMessage(err.message || "Failed to parse CSV file.");
        setUploadSuccess(false);
        setParsedData([]);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) {
      throw new Error("CSV file is empty or missing data rows.");
    }
    
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const nameIndex = headers.indexOf("name");
    const emailIndex = headers.indexOf("email");
    const deptIndex = headers.indexOf("department");
    const semIndex = headers.indexOf("semester");
    
    if (nameIndex === -1 || emailIndex === -1 || deptIndex === -1 || semIndex === -1) {
      throw new Error("Invalid CSV headers. Must include: name, email, department, semester");
    }
    
    const list = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
      if (cols.length < headers.length) continue;
      
      list.push({
        name: cols[nameIndex],
        email: cols[emailIndex],
        department: cols[deptIndex],
        semester: cols[semIndex],
      });
    }
    return list;
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) return;
    setUploading(true);
    setUploadMessage("");
    try {
      const res = await fetch("/api/student/bulk-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: parsedData }),
      });
      const data = await res.json();
      if (data.success) {
        setUploadSuccess(true);
        setUploadMessage(data.message);
        setParsedData([]);
        setCsvFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        loadStudents();
      } else {
        setUploadSuccess(false);
        setUploadMessage(data.message || "Bulk upload failed.");
      }
    } catch (err: any) {
      setUploadSuccess(false);
      setUploadMessage(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-2">
            Browse BCA student records by semester or upload in bulk.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadArea(!showUploadArea)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 bg-white px-5 py-3 rounded-2xl text-sm font-semibold transition flex items-center gap-2"
          >
            <Upload size={18} />
            Bulk CSV Upload
          </button>
        </div>
      </div>

      {/* CSV upload card */}
      {showUploadArea && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-xl text-gray-900">Upload Students CSV</h2>
              <p className="text-sm text-gray-500 mt-1">Select a CSV file following the standard template headers.</p>
            </div>
            <button
              onClick={() => setShowUploadArea(false)}
              className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
            >
              Close
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* File drop zone */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText size={40} className="text-gray-400 mb-3" />
              <p className="font-semibold text-gray-700">
                {csvFile ? csvFile.name : "Click to browse or drag & drop CSV file"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Supports standard CSV file formats up to 5MB</p>
            </div>

            {/* Template tip */}
            <div className="bg-gray-50/80 rounded-2xl p-6 text-sm text-gray-600 space-y-3">
              <p className="font-semibold text-gray-800">💡 CSV Header Template Requirements:</p>
              <p>Your CSV columns must include precisely the following case-insensitive headers:</p>
              <code className="block bg-white border border-gray-100 p-3 rounded-xl font-mono text-xs text-gray-700">
                name, email, department, semester
              </code>
              <p>Registered students can log in using their email and default password **`Password@123`**.</p>
            </div>
          </div>

          {/* Parsed Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Parsed Preview ({parsedData.length} students found)</h3>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-black hover:opacity-90 text-white px-5 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                >
                  {uploading ? "Registering Students..." : "Confirm & Import Students"}
                </button>
              </div>

              <div className="border border-gray-100 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-600 border-b border-gray-100">
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Semester</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {parsedData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-gray-900">{row.name}</td>
                        <td className="p-3 text-gray-500">{row.email}</td>
                        <td className="p-3 text-gray-600">{row.department}</td>
                        <td className="p-3 text-gray-600">Sem {row.semester}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadMessage && (
            <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2 ${
              uploadSuccess ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
            }`}>
              {uploadSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {uploadMessage}
            </div>
          )}
        </div>
      )}

      {/* Semester Filter and Listing */}
      <div className="flex justify-between items-center bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
        <span className="text-gray-600 font-semibold pl-2">Filter Semester:</span>
        <select
          value={semester}
          onChange={(event) => {
            setSemester(event.target.value);
            loadStudents(event.target.value);
          }}
          className="border border-gray-200 rounded-2xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1.5fr_120px_120px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Name</div>
          <div>Email</div>
          <div>Department</div>
          <div>Semester</div>
        </div>
        <div className="divide-y">
          {students.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-[1.3fr_1.5fr_120px_120px] gap-4 px-6 py-4 items-center hover:bg-gray-50/30 transition-colors"
            >
              <div className="font-semibold text-gray-900">{student.name}</div>
              <div className="text-gray-500 truncate">{student.email}</div>
              <div className="text-gray-600">{student.department}</div>
              <div className="text-gray-600">Sem {student.semester}</div>
            </div>
          ))}

          {students.length === 0 && (
            <div className="px-6 py-10 text-gray-500 text-center">
              No student records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
