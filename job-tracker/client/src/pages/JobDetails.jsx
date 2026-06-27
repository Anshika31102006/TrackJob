import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ThemeContext } from "../context/ThemeContext";

export default function JobDetails() {
  const navigate = useNavigate();
  const { darkMode, sidebarOpen } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchField, setSearchField] = useState("company");
  const [viewingResume, setViewingResume] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs in details page:", err);
    }
  };

  const updateJob = async () => {
    try {
      await API.put(`/jobs/${editingJob._id}`, editingJob);

      setJobs(
        jobs.map((job) =>
          job._id === editingJob._id ? editingJob : job
        )
      );

      setEditingJob(null);
      alert("✅ Job Updated Successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update job");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const fieldVal = job[searchField]?.toLowerCase() || "";
    return fieldVal.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Job Details" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-5xl mx-auto w-full space-y-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              Applications Tracker 🚀
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Deep dive into specific application details, specs, and timelines.
            </p>
          </div>

          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${
              darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search By */}
              <div className="flex flex-col shrink-0">
                <label className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Search Basis
                </label>
                <select
                  value={searchField}
                  onChange={(e) => {
                    setSearchField(e.target.value);
                    setInputValue("");
                    setSearchTerm("");
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="company">Company Name</option>
                  <option value="role">Role</option>
                  <option value="jobSpec">Job Description</option>
                </select>
              </div>

              {/* Search Value */}
              <div className="flex flex-col flex-1">
                <label className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Enter Search Value
                </label>
                <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-850 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    type="text"
                    placeholder={`Search for job matching ${searchField}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearchTerm(inputValue);
                      }
                    }}
                    className={`flex-1 px-4 py-2.5 text-sm outline-none ${
                      darkMode
                        ? "bg-[#0B0F19] text-white placeholder-slate-500"
                        : "bg-slate-50 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                  <button
                    onClick={() => setSearchTerm(inputValue)}
                    className="bg-green-600 px-5 text-white hover:bg-green-700 transition"
                  >
                    🔍
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredJobs.length === 0 && (
            <div className="p-8 rounded-2xl border border-dashed text-center text-slate-400">
              No matching applications found.
            </div>
          )}

          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className={`rounded-2xl p-5 sm:p-6 border shadow-sm space-y-6 ${
                  darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3.5">
                    {job.companyLogo ? (
                      <img
                        src={`http://localhost:5001/uploads/${job.companyLogo}`}
                        alt={job.company}
                        className="w-14 h-14 object-cover bg-white rounded-xl border shadow-sm p-0.5 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-xl rounded-xl border shrink-0">
                        {job.company ? job.company.charAt(0) : "J"}
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-bold leading-snug">{job.company}</h2>
                      <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{job.role}</p>
                    </div>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm inline-block ${
                      job.status === "Applied"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : job.status === "Interview"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        : job.status === "Rejected"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">OA Status</p>
                    <p className="font-bold text-sm mt-1">{job.oaStatus || "Not Given"}</p>
                  </div>

                  <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interview Invite</p>
                    <p className="font-bold text-sm mt-1">{job.interviewCall || "No"}</p>
                  </div>

                  <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Applied On</p>
                    <p className="font-bold text-sm mt-1">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Job Specification */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm tracking-tight">Job Specification</h3>
                  <div
                    className={`p-4 rounded-xl border text-sm leading-relaxed ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    {job.jobSpec || "No specification added"}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm tracking-tight">Pipeline Timeline</h3>

                  <div className="flex items-center justify-between overflow-x-auto pb-2 gap-4">
                    <div className="flex flex-col items-center shrink-0 min-w-[90px]">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <p className="mt-2 text-xs font-bold">Applied</p>
                    </div>

                    <div className={`flex-1 h-0.5 min-w-[40px] ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}></div>

                    <div className="flex flex-col items-center shrink-0 min-w-[90px]">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          job.oaStatus === "Cleared"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {job.oaStatus === "Cleared" ? "✓" : "?"}
                      </div>
                      <p className="mt-2 text-xs font-bold">OA Cleared</p>
                    </div>

                    <div className={`flex-1 h-0.5 min-w-[40px] ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}></div>

                    <div className="flex flex-col items-center shrink-0 min-w-[90px]">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          job.interviewCall === "Yes"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {job.interviewCall === "Yes" ? "✓" : "?"}
                      </div>
                      <p className="mt-2 text-xs font-bold">Interview</p>
                    </div>

                    <div className={`flex-1 h-0.5 min-w-[40px] ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}></div>

                    <div className="flex flex-col items-center shrink-0 min-w-[90px]">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                          job.status === "Offer"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {job.status === "Offer" ? "🎉" : "?"}
                      </div>
                      <p className="mt-2 text-xs font-bold">Offer Received</p>
                    </div>
                  </div>
                </div>

                <hr className={`${darkMode ? "border-slate-800" : "border-slate-100"}`} />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => setEditingJob({ ...job })}
                    className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold text-xs tracking-wide shadow-sm transition"
                  >
                    ✏️ Update Status
                  </button>

                  {job.resume && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setViewingResume(`http://localhost:5001/api/jobs/view-resume/${job.resume}`)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wide shadow-md shadow-indigo-600/10 transition"
                      >
                        📄 View Resume
                      </button>
                      <a
                        href={`http://localhost:5001/uploads/${job.resume}`}
                        download
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition"
                      >
                        ⬇️ Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>


      {editingJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 text-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4">Update Application Status</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Application Status</label>
                <select
                  value={editingJob.status}
                  onChange={(e) =>
                    setEditingJob({
                      ...editingJob,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-700 border border-slate-600 outline-none text-sm"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Rejected</option>
                  <option>Offer</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">OA Status</label>
                <select
                  value={editingJob.oaStatus}
                  onChange={(e) =>
                    setEditingJob({
                      ...editingJob,
                      oaStatus: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-700 border border-slate-600 outline-none text-sm"
                >
                  <option>Not Given</option>
                  <option>Cleared</option>
                  <option>Failed</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Interview Call</label>
                <select
                  value={editingJob.interviewCall}
                  onChange={(e) =>
                    setEditingJob({
                      ...editingJob,
                      interviewCall: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-700 border border-slate-600 outline-none text-sm"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Applied Date</label>
                  <input
                    type="date"
                    value={editingJob.applicationDate || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        applicationDate: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-700 border border-slate-600 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Deadline</label>
                  <input
                    type="date"
                    value={editingJob.deadline || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        deadline: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-700 border border-slate-600 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateJob}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2.5 rounded-xl font-bold text-sm shadow-md transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingJob(null)}
                className="flex-1 bg-red-650 bg-red-600 hover:bg-red-700 py-2.5 rounded-xl font-bold text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
          </div>
      
      )}

      {/* PDF Viewer Modal */}
      {viewingResume && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-white font-bold text-lg">📄 Resume Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingResume(null)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <div className="flex-1 p-2">
              <iframe
                src={viewingResume}
                title="Resume Preview"
                className="w-full h-full rounded-lg border border-slate-700"
              />
            </div>
          </div>
        </div>
      )}
      </div>
  );
}

