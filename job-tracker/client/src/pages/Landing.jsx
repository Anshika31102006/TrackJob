import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const FEATURES = [
  {
    icon: "📊",
    title: "Real-Time Dashboard",
    description:
      "Monitor all your applications in one sleek dashboard. Track statuses, deadlines, and progress at a glance.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    description:
      "Never miss a deadline. Get timely reminders for upcoming OAs, interviews, and application deadlines.",
  },
  {
    icon: "📈",
    title: "Analytics & Insights",
    description:
      "Visualize your job search performance with detailed analytics — success rates, response times, and trends.",
  },
];

const STATS = [
  { value: "10x", label: "Faster Tracking" },
  { value: "100%", label: "Organized" },
  { value: "0", label: "Missed Deadlines" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [landingDarkMode, setLandingDarkMode] = useState(() => {
    return localStorage.getItem("landingDarkMode") === "true";
  });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
      return;
    }
    setIsVisible(true);
  }, [navigate]);

  const toggleTheme = () => {
    setLandingDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("landingDarkMode", next);
      return next;
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-hidden relative ${
        landingDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      {/* Background radial effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div
          className={`absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-300 ${
            landingDarkMode ? "bg-indigo-600/10" : "bg-indigo-600/5"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-300 ${
            landingDarkMode ? "bg-indigo-500/8" : "bg-indigo-500/4"
          }`}
        ></div>
      </div>

      {/* Navigation Bar */}
      <nav
        className={`relative z-20 flex items-center justify-between px-6 sm:px-12 lg:px-20 py-5 border-b transition-colors duration-300 ${
          landingDarkMode ? "border-slate-800/50" : "border-slate-200/60"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-600/30">
            T
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Track<span className="text-indigo-500">Job</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Light/Dark mode switch button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-colors ${
              landingDarkMode
                ? "border-slate-800 hover:bg-slate-800 text-amber-400"
                : "border-slate-200 hover:bg-slate-100 text-slate-600"
            }`}
            title={landingDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {landingDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => navigate("/login")}
            className={`px-4 py-2.5 text-sm font-semibold transition ${
              landingDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 sm:px-12 lg:px-20 pt-16 sm:pt-24 pb-16">
        <div
          className={`max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border ${
                landingDarkMode
                  ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400"
                  : "bg-indigo-50 border-indigo-100 text-indigo-600"
              }`}
            >
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider">
                Job Application Tracker
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Track Your Applications{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>

            <p
              className={`mt-6 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 ${
                landingDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Stop using messy spreadsheets. TrackJob gives you a powerful,
              beautiful dashboard to manage every job application — from
              submission to offer — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:shadow-indigo-600/40 hover:-translate-y-0.5 text-sm tracking-wide"
              >
                Get Started — It's Free 🚀
              </button>
              <button
                onClick={() => navigate("/login")}
                className={`w-full sm:w-auto px-8 py-4 font-semibold rounded-xl border transition-all duration-200 text-sm ${
                  landingDarkMode
                    ? "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700/50"
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                I Have an Account
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-extrabold text-indigo-500">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs font-medium mt-0.5 ${
                      landingDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="max-w-xl w-full flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-indigo-400/10 rounded-3xl blur-2xl"></div>
              <img
                src="/landing_hero.jpg"
                alt="TrackJob Dashboard Preview"
                className={`relative rounded-2xl shadow-2xl border w-full ${
                  landingDarkMode ? "border-slate-850 border-slate-800/60" : "border-slate-200"
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Choose <span className="text-indigo-500">TrackJob</span>?
            </h2>
            <p className={landingDarkMode ? "text-slate-400 mt-3 max-w-lg mx-auto" : "text-slate-500 mt-3 max-w-lg mx-auto"}>
              Everything you need to stay organized and land your dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className={`group p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  landingDarkMode
                    ? "bg-[#151D30]/60 border-slate-800/60 hover:border-indigo-500/30 hover:shadow-indigo-900/10"
                    : "bg-white border-slate-200/80 hover:border-indigo-500/20 hover:shadow-slate-200/50"
                }`}
              >
                <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className={`text-sm leading-relaxed ${landingDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className={`p-10 sm:p-14 rounded-3xl border ${
              landingDarkMode
                ? "bg-gradient-to-br from-indigo-600/10 to-indigo-900/10 border-indigo-500/20"
                : "bg-indigo-50/50 border-indigo-100"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Take Control?
            </h2>
            <p className={`mt-4 max-w-md mx-auto ${landingDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Join TrackJob and never lose track of a job application again.
              Your next career move starts here.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="mt-8 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:shadow-indigo-600/40 hover:-translate-y-0.5 text-sm tracking-wide"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 px-6 sm:px-12 lg:px-20 py-8 border-t transition-colors duration-300 ${
          landingDarkMode ? "border-slate-800/50" : "border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
              T
            </div>
            <span className="text-sm font-bold">
              Track<span className="text-indigo-500">Job</span>
            </span>
          </div>
          <p className={`text-xs ${landingDarkMode ? "text-slate-600" : "text-slate-400"}`}>
            © 2026 TrackJob. Built with ❤️ for job seekers everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
