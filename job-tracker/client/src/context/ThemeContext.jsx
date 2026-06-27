import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const LIGHT_THEMES = [
  { id: "slate", name: "Plain White ⚪", class: "bg-[#ffffff]", hex: "#ffffff" },
  { id: "mustard", name: "Warm Mustard 💛", class: "bg-[#fffbeb]", hex: "#fffbeb" },
  { id: "cool-ice", name: "Ocean Blue 🌊", class: "bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] bg-fixed", hex: "#eff6ff" },
  { id: "lilac", name: "Lilac Purple 🔮", class: "bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff] bg-fixed", hex: "#faf5ff" },
];

export const DARK_THEMES = [
  { id: "midnight", name: "Midnight Navy 🌌", class: "bg-[#0B0F19]", hex: "#0B0F19" },
  { id: "charcoal", name: "Charcoal 🖤", class: "bg-[#121212]", hex: "#121212" },
  { id: "amethyst", name: "Deep Amethyst 🔮", class: "bg-[#0e0a16]", hex: "#0e0a16" },
  { id: "emerald", name: "Emerald Velvet 🌲", class: "bg-[#0a0f0d]", hex: "#0a0f0d" },
];

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [bgTheme, setBgTheme] = useState(() => {
    return localStorage.getItem("bgTheme") || (darkMode ? "midnight" : "slate");
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    
    // Choose correct theme list based on dark mode status
    const currentList = darkMode ? DARK_THEMES : LIGHT_THEMES;
    // Find selected theme, fallback if mismatch
    let selectedTheme = currentList.find(t => t.id === bgTheme);
    if (!selectedTheme) {
      selectedTheme = currentList[0];
      setBgTheme(selectedTheme.id);
    }

    localStorage.setItem("bgTheme", selectedTheme.id);

    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.className = `${selectedTheme.class} text-slate-100 min-h-screen transition-colors duration-300`;
    } else {
      document.documentElement.classList.remove("dark");
      document.body.className = `${selectedTheme.class} text-slate-800 min-h-screen transition-colors duration-300`;
    }
  }, [darkMode, bgTheme]);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      setBgTheme(next ? "midnight" : "slate");
      return next;
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        bgTheme,
        setBgTheme,
        LIGHT_THEMES,
        DARK_THEMES,
        // Keep aliases for backward compatibility just in case
        mobileSidebarOpen: sidebarOpen,
        setMobileSidebarOpen: setSidebarOpen,
        toggleMobileSidebar: toggleSidebar,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
