import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  Briefcase,
  PlusCircle,
  BarChart3,
  List,
  Calendar,
  Bell,
  Settings,
  User,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const { darkMode, sidebarOpen, setSidebarOpen } = useContext(ThemeContext);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <Briefcase size={18} /> },
    { name: "Add Job", path: "/add-job", icon: <PlusCircle size={18} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={18} /> },
    { name: "Job Details", path: "/jobs", icon: <List size={18} /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  const handleLinkClick = () => {
    // Only auto-close sidebar on link click if we are on a mobile viewport
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Overlay Background */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 border-r transition-all duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          darkMode
            ? "bg-[#151D30] border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        } flex flex-col`}
      >
        {/* LOGO & CLOSE BUTTON */}
        <div className="p-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            🚀 TrackJob
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Collapse Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20"
                    : darkMode
                    ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* INFO FOOTER */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/80 text-xs opacity-75">
          <p className="px-2">Track applications, resumes, and timelines efficiently.</p>
        </div>

        {/* ACCOUNT ACTION */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-500 py-3 rounded-xl text-sm font-semibold transition duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}