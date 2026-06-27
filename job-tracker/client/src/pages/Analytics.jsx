import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const navigate = useNavigate();
  const { darkMode, sidebarOpen } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Failed to fetch jobs:", err));
  }, [navigate]);

  const applied = jobs.filter((j) => j.status === "Applied").length;
  const interview = jobs.filter((j) => j.status === "Interview").length;
  const rejected = jobs.filter((j) => j.status === "Rejected").length;
  const offer = jobs.filter((j) => j.status === "Offer").length;
  const total = jobs.length;

  const successRate = total > 0 ? ((offer / total) * 100).toFixed(1) : 0;

  const data = [
    { name: "Applied", value: applied },
    { name: "Interview", value: interview },
    { name: "Rejected", value: rejected },
    { name: "Offer", value: offer },
  ];

  const COLORS = ["#3b82f6", "#facc15", "#ef4444", "#22c55e"];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Analytics" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              Analytics Dashboard 📊
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Detailed statistical breakdown of your software career applications.
            </p>
          </div>

          {/* TOP CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card title="Applied" value={applied} color="text-blue-500 dark:text-blue-400" darkMode={darkMode} />
            <Card title="Interview" value={interview} color="text-amber-500 dark:text-amber-400" darkMode={darkMode} />
            <Card title="Rejected" value={rejected} color="text-rose-500 dark:text-rose-400" darkMode={darkMode} />
            <Card title="Offers" value={offer} color="text-emerald-500 dark:text-emerald-400" darkMode={darkMode} />
            <Card title="Success Rate" value={`${successRate}%`} color="text-indigo-500 dark:text-indigo-400" darkMode={darkMode} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PIE CHART */}
            <div
              className={`p-6 rounded-2xl border shadow-sm lg:col-span-2 flex flex-col justify-between ${
                darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
                Job Application Distribution
              </h3>

              <div className="h-[320px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", background: darkMode ? "#151D30" : "#fff", color: darkMode ? "#fff" : "#000", border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SUMMARY & QUICK INSIGHTS */}
            <div className="space-y-6">
              <div
                className={`p-6 rounded-2xl border shadow-sm ${
                  darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                  📌 Key Metrics Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <span className="text-slate-400 text-sm">Total Applications</span>
                    <span className="font-bold text-lg">{total}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <span className="text-slate-400 text-sm">Offers Received</span>
                    <span className="font-bold text-lg text-emerald-500">{offer}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-400 text-sm">Overall Success Rate</span>
                    <span className="font-bold text-lg text-indigo-500">{successRate}%</span>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 rounded-2xl border shadow-sm ${
                  darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                  💡 Performance Insight
                </h3>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {total === 0
                    ? "Start logging your applications on the Add Job page to display statistical analysis of your job pipelines!"
                    : successRate > 15
                    ? "Great job! Your success rate is looking very strong. Keep nailing those interview call rounds."
                    : "Consistency is key! Apply to more roles, customize your resume files, and check on deadline alerts regularly."}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({ title, value, color, darkMode }) {
  return (
    <div
      className={`p-5 rounded-2xl text-center border shadow-sm transition hover:scale-[1.02] ${
        darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      <h2 className={`text-3xl font-extrabold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}