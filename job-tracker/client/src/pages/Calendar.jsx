import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

export default function CalendarPage() {
  const navigate = useNavigate();
  const { darkMode, sidebarOpen } = useContext(ThemeContext);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        const calendarEvents = res.data
          .filter((job) => job.applicationDate)
          .map((job) => ({
            title: `${job.company} - ${job.role}`,
            start: new Date(job.applicationDate),
            end: new Date(job.applicationDate),
          }));

        setEvents(calendarEvents);
      } catch (err) {
        console.error("Failed to fetch jobs for calendar:", err);
      }
    };

    fetchJobs();
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Calendar" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              Schedules Calendar 📅
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Stay on top of upcoming Online Assessments and Interview dates.
            </p>
          </div>

          {/* Month & Year Selectors */}
          <div
            className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-4 items-stretch sm:items-center ${
              darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <label className={`text-sm font-semibold shrink-0 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Month:
              </label>
              <select
                value={currentDate.getMonth()}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-[#0B0F19] border-slate-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                {MONTHS.map((month, i) => (
                  <option key={i} value={i}>{month}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className={`text-sm font-semibold shrink-0 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Year:
              </label>
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? "bg-[#0B0F19] border-slate-800 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                📅 Today
              </button>
            </div>
          </div>

          <div
            className={`p-4 sm:p-6 rounded-2xl shadow-lg border h-[650px] transition-colors ${
              darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <Calendar
              localizer={localizer}
              events={events}
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              startAccessor="start"
              endAccessor="end"
              views={["month", "week", "day", "agenda"]}
              defaultView="month"
              popup
              selectable
              toolbar={true}
              drilldownView="day"
              step={30}
              timeslots={2}
              style={{
                height: "100%",
                color: darkMode ? "#f8fafc" : "#0f172a",
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}