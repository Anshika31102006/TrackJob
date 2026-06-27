import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ThemeContext } from "../context/ThemeContext";

export default function AddJob() {
  const navigate = useNavigate();
  const { darkMode, sidebarOpen } = useContext(ThemeContext);

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    jobSpec: "",
    oaStatus: "Not Given",
    interviewCall: "No",
    applicationDate: "",
    deadline: "",
    reminderDays: "5",
  });

  const [file, setFile] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    if (file) data.append("resume", file);
    if (logo) data.append("companyLogo", logo);

    try {
      await API.post("/jobs", data);
      alert("✅ Job Added Successfully!");

      setForm({
        company: "",
        role: "",
        status: "Applied",
        jobSpec: "",
        oaStatus: "Not Given",
        interviewCall: "No",
        applicationDate: "",
        deadline: "",
        reminderDays: "5",
      });

      setFile(null);
      setLogo(null);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to add job: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Add Job" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-3xl mx-auto w-full">
          <form
            onSubmit={handleSubmit}
            className={`p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6 ${
              darkMode
                ? "bg-[#151D30] border-slate-800 text-white shadow-black/20"
                : "bg-white border-slate-200 text-slate-900 shadow-slate-100"
            }`}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Add New Application 🚀</h2>
              <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Add jobs to track deadlines, OA status, and interview pipelines.
              </p>
            </div>

            <hr className={`${darkMode ? "border-slate-800" : "border-slate-100"}`} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. Google"
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-[#0B0F19] border-slate-800 text-white placeholder-slate-600"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode
                      ? "bg-[#0B0F19] border-slate-800 text-white placeholder-slate-600"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Job Specification / Description
              </label>
              <textarea
                rows={3}
                value={form.jobSpec}
                onChange={(e) => setForm({ ...form, jobSpec: e.target.value })}
                placeholder="Paste the job description, link, or notes here..."
                className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-[#0B0F19] border-slate-800 text-white placeholder-slate-600"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Application Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <option className="text-black">Not Applied</option>
                  <option className="text-black">Applied</option>
                  <option className="text-black">OA Cleared</option>
                  <option className="text-black">Interview</option>
                  <option className="text-black">Offer</option>
                  <option className="text-black">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Reminder Before Deadline
                </label>
                <select
                  value={form.reminderDays}
                  onChange={(e) => setForm({ ...form, reminderDays: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <option className="text-black" value="1">1 Day Before</option>
                  <option className="text-black" value="3">3 Days Before</option>
                  <option className="text-black" value="5">5 Days Before</option>
                  <option className="text-black" value="7">7 Days Before</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Applied Date
                </label>
                <input
                  type="date"
                  value={form.applicationDate}
                  onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Set Deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  OA (Online Assessment)
                </label>
                <select
                  value={form.oaStatus}
                  onChange={(e) => setForm({ ...form, oaStatus: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <option className="text-black">Not Given</option>
                  <option className="text-black">Cleared</option>
                  <option className="text-black">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Interview Call
                </label>
                <select
                  value={form.interviewCall}
                  onChange={(e) => setForm({ ...form, interviewCall: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <option className="text-black">No</option>
                  <option className="text-black">Yes</option>
                </select>
              </div>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Upload Resume
                </label>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <span className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-350 border-slate-700 hover:border-slate-650"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}>
                    Choose Resume
                  </span>
                  <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {file ? file.name : "No file chosen"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Company Logo
                </label>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <span className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-350 border-slate-700 hover:border-slate-650"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}>
                    Choose Logo Image
                  </span>
                  <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {logo ? logo.name : "No file chosen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogo(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {logo && (
                  <div className="mt-2.5">
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Logo Preview"
                      className="w-14 h-14 object-contain bg-white rounded-xl p-1 border shadow"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition duration-200"
              >
                Add Application to Pipeline
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}