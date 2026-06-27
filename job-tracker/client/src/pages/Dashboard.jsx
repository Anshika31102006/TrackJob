import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ThemeContext } from "../context/ThemeContext";
import { syncNotifications } from "../utils/notificationService";
import { Search, Eye, Download, Edit2, Trash2 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, sidebarOpen } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
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
      syncNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job application?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  const openEdit = (job) => {
    setEditJob(job);
    setForm(job);
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/jobs/${editJob._id}`, form);
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      console.error("Failed to update job:", err);
    }
  };

  // 🔍 FILTER LOGIC
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      (job.jobSpec || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" ? true : job.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Dashboard" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                Job Dashboard 🚀
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Monitor your pipelines, schedules, and application updates.
              </p>
            </div>
          </div>

          {/* 🔍 SEARCH + FILTER SECTION */}
          <div
            className={`p-4 rounded-2xl border mb-6 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center ${
              darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {/* Search Input */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search by company or role"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-[#0B0F19] border-slate-800 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-3">
              <label className={`text-sm font-semibold shrink-0 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Filter Status:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-[#0B0F19] border-slate-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <option value="All">All Applications</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
          </div>

          {/* 📊 RESPONSIVE TABLE CONTAINER */}
          <div
            className={`rounded-2xl border shadow-sm overflow-hidden ${
              darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "bg-slate-800/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    <th className="p-4">Company</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">OA Status</th>
                    <th className="p-4 text-center">Interview</th>
                    <th className="p-4 text-center">Resume</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${darkMode ? "divide-slate-800/80" : "divide-slate-100"}`}>
                  {filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className={`transition-colors ${
                        darkMode ? "hover:bg-slate-800/20" : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className={`p-4 font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{job.company}</td>
                      <td className={`p-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{job.role}</td>

                      {/* STATUS BADGE */}
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide inline-block shadow-sm
                          ${
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
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            job.oaStatus === "Cleared"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                              : job.oaStatus === "Failed"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {job.oaStatus || "Not Given"}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            job.interviewCall === "Yes"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {job.interviewCall || "No"}
                        </span>
                      </td>

                      {/* RESUME */}
                      <td className="p-4 text-center">
                        {job.resume ? (
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => setViewingResume(`http://localhost:5001/api/jobs/view-resume/${job.resume}`)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                              title="View Resume"
                            >
                              <Eye size={14} />
                            </button>
                            <a
                              href={`http://localhost:5001/uploads/${job.resume}`}
                              download
                              className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition"
                              title="Download Resume"
                            >
                              <Download size={14} />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => openEdit(job)}
                            className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white transition"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-505 hover:bg-rose-500 hover:text-white transition"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredJobs.length === 0 && (
              <div className="p-8 text-center text-slate-400">No applications matched the criteria.</div>
            )}
          </div>
        </main>
      </div>

      {/* ✏️ EDIT MODAL */}
      {editJob && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-md p-6 rounded-2xl border shadow-xl transition-all duration-300 ${
              darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Edit Application</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-400">Company</label>
                <input
                  value={form.company || ""}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-400">Role</label>
                <input
                  value={form.role || ""}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-400">Status</label>
                  <select
                    value={form.status || "Applied"}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Rejected</option>
                    <option>Offer</option>
                  </select>
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-400">OA Status</label>
                  <select
                    value={form.oaStatus || "Not Given"}
                    onChange={(e) => setForm({ ...form, oaStatus: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option>Not Given</option>
                    <option>Cleared</option>
                    <option>Failed</option>
                  </select>
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-400">Interview</label>
                  <select
                    value={form.interviewCall || "No"}
                    onChange={(e) => setForm({ ...form, interviewCall: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-400">Applied Date</label>
                  <input
                    type="date"
                    value={form.applicationDate || ""}
                    onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-400">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline || ""}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditJob(null)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingResume && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl ${
            darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
          }`}>
            <div className={`flex items-center justify-between p-4 border-b ${
              darkMode ? "border-slate-700" : "border-slate-200"
            }`}>
              <h3 className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>📄 Resume Preview</h3>
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
                className={`w-full h-full rounded-lg border ${darkMode ? "border-slate-700" : "border-slate-200"}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}