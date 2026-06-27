import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { syncNotifications } from "../utils/notificationService";
import { Trash2, Check, CheckSquare } from "lucide-react";

export default function Notifications() {
  const navigate = useNavigate();
  const { darkMode, sidebarOpen } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  const loadNotifications = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("notifications"));
      setNotifications(Array.isArray(saved) ? saved : []);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const syncAndLoad = async () => {
      try {
        const res = await API.get("/jobs");
        syncNotifications(res.data);
      } catch (err) {
        console.error("Failed to sync notifications from jobs:", err);
      }
      loadNotifications();
    };

    syncAndLoad();
  }, [navigate]);

  const markRead = (id) => {
    const updated = notifications.map((n) =>
      n._id === id ? { ...n, read: !n.read } : n
    );
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n._id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const filtered = Array.isArray(notifications)
    ? filter === "All"
      ? notifications
      : filter === "Read"
      ? notifications.filter((n) => n.read)
      : notifications.filter((n) => !n.read)
    : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Notifications" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                Reminders & Alerts 🔔
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Manage and track all upcoming application milestones.
              </p>
            </div>

            {/* Filter Section */}
            <div className="flex items-center gap-3 shrink-0">
              <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Show:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`p-2.5 rounded-xl border text-sm font-medium outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-[#151D30] border-slate-800 text-white"
                    : "bg-white border-slate-200 text-slate-950"
                }`}
              >
                <option value="All">All Notifications</option>
                <option value="Read">Read Alerts</option>
                <option value="Unread">Unread Alerts</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filtered.map((n) => (
              <div
                key={n._id}
                className={`p-5 rounded-2xl shadow-sm border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  n.read
                    ? darkMode
                      ? "bg-[#151D30]/60 border-slate-800/80 text-slate-400"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                    : darkMode
                    ? "bg-slate-850 bg-[#151D30] border-indigo-600 text-white"
                    : "bg-indigo-50/50 border-indigo-200 text-slate-950"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base">{n.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        n.priority === "High"
                          ? "bg-rose-500/15 text-rose-500"
                          : "bg-amber-500/15 text-amber-500"
                      }`}
                    >
                      {n.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm opacity-90">{n.message}</p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => markRead(n._id)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      n.read
                        ? "bg-transparent border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        : "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                    }`}
                  >
                    {n.read ? (
                      <>
                        <CheckSquare size={13} />
                        Mark Unread
                      </>
                    ) : (
                      <>
                        <Check size={13} />
                        Mark Read
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-transparent transition"
                    title="Delete Notification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={`p-8 rounded-2xl border border-dashed text-center ${
              darkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"
            }`}>
              No notifications available at this time.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}