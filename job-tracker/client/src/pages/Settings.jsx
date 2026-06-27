import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Bell, BellOff, Download, ShieldAlert, Key } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme, sidebarOpen, bgTheme, setBgTheme, LIGHT_THEMES, DARK_THEMES } = useContext(ThemeContext);

  const [notifications, setNotifications] = useState(() => {
    try {
      const val = localStorage.getItem("notifications_enabled");
      return val === null ? true : val === "true";
    } catch {
      return true;
    }
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handlePasswordChange = async () => {
    try {
      await API.put("/auth/change-password", passwords);
      alert("✅ Password changed successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to change password");
    }
  };

  const toggleNotifications = () => {
    const value = !notifications;
    setNotifications(value);
    localStorage.setItem("notifications_enabled", JSON.stringify(value));

    if ("Notification" in window) {
      if (value && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
  };

  const exportJobs = async () => {
    try {
      const res = await API.get("/jobs");
      const jobsData = res.data;
      if (jobsData.length === 0) {
        alert("No jobs to export!");
        return;
      }

      const headers = [
        "Company",
        "Role",
        "Status",
        "OA Status",
        "Interview Call",
        "Job Specification",
        "Applied Date",
        "Deadline",
        "Created At",
      ];
      const csvRows = [headers.join(",")];

      jobsData.forEach((job) => {
        const row = [
          `"${(job.company || "").replace(/"/g, '""')}"`,
          `"${(job.role || "").replace(/"/g, '""')}"`,
          `"${(job.status || "").replace(/"/g, '""')}"`,
          `"${(job.oaStatus || "").replace(/"/g, '""')}"`,
          `"${(job.interviewCall || "").replace(/"/g, '""')}"`,
          `"${(job.jobSpec || "").replace(/"/g, '""')}"`,
          `"${job.applicationDate || ""}"`,
          `"${job.deadline || ""}"`,
          `"${new Date(job.createdAt).toLocaleDateString()}"`,
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `trackjob_applications_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export jobs:", err);
      alert("❌ Failed to export jobs");
    }
  };

  const clearAllJobs = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all your jobs? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await API.delete("/jobs");
      alert("✅ All jobs deleted successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete jobs");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Settings" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-5xl mx-auto w-full space-y-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              ⚙️ Settings
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Configure layout modes, notifications preferences, and security options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Toggle Card */}
            <div
              className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 ${
                darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  {darkMode ? <Moon size={22} /> : <Sun size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-base">Color Theme Mode</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle between dark obsidian and light gray styles.</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Switch to {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>

            {/* Custom Background Color Selection */}
            <div
              className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 md:col-span-2 ${
                darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  🎨
                </div>
                <div>
                  <h3 className="font-bold text-base">Custom Background Color</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Select a premium tint that fits your design aesthetic.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {(darkMode ? DARK_THEMES : LIGHT_THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setBgTheme(theme.id)}
                    className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      bgTheme === theme.id
                        ? "border-indigo-500 ring-2 ring-indigo-500/30"
                        : darkMode
                        ? "border-slate-800 bg-[#0B0F19] hover:bg-slate-800"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: theme.hex }}
                    />
                    {theme.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications Toggle Card */}
            <div
              className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 ${
                darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  {notifications ? <Bell size={22} /> : <BellOff size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-base">Deadline Notifications</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle system alerts and alarms for application deadlines.</p>
                </div>
              </div>
              <button
                onClick={toggleNotifications}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                  notifications
                    ? "bg-[#0B0F19] text-slate-300 dark:hover:bg-slate-900 hover:bg-slate-100 border border-slate-200 dark:border-slate-800"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {notifications ? "Disable Notifications" : "Enable Notifications"}
              </button>
            </div>

            {/* CSV Export Card */}
            <div
              className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 ${
                darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <Download size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base">Export Applications Data</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Download all application lists as a single CSV spreadsheet file.</p>
                </div>
              </div>
              <button
                onClick={exportJobs}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Download CSV Spreadsheet
              </button>
            </div>

            {/* Change Password Card */}
            <div
              className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
                darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <Key size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base">Change Profile Password</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Set a new secure password for your account.</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"
                  }`}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value,
                    })
                  }
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-black"
                  }`}
                />
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Update Password
              </button>
            </div>

            {/* Clear Jobs Card */}
            <div
              className={`p-6 rounded-2xl border border-rose-500/30 md:col-span-2 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                darkMode ? "bg-rose-950/10" : "bg-rose-50/20"
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl shrink-0">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-rose-600 dark:text-rose-500">Danger Zone: Clear All Jobs</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Permanently delete every logged job application from your system.</p>
                </div>
              </div>

              <button
                onClick={clearAllJobs}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition shrink-0"
              >
                Clear All Job Data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}