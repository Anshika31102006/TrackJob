import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Menu, LogOut, Sun, Moon } from "lucide-react";

export default function Navbar({ title }) {
  const { darkMode, toggleTheme, sidebarOpen, toggleSidebar } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      className={`fixed top-0 left-0 ${
        sidebarOpen ? "md:left-64" : "md:left-0"
      } right-0 h-16 flex items-center justify-between px-6 z-30 border-b transition-all duration-300 shadow-sm ${
        darkMode
          ? "bg-[#151D30]/90 border-slate-800/80 text-white backdrop-blur-md"
          : "bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Toggle menu button (Hamburger icon) */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Expand Sidebar"
            title="Expand Sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <h4 className="text-xl font-bold tracking-tight">{title}</h4>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? "hover:bg-slate-800 text-amber-400" : "hover:bg-slate-100 text-slate-600"
          }`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-sm shadow-sm transition"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}