import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { ThemeContext } from "../context/ThemeContext";

export default function Profile() {
  const navigate = useNavigate();
  const { darkMode, sidebarOpen } = useContext(ThemeContext);

  const [parsing, setParsing] = useState(false);

  // Ensure URLs have a protocol prefix so they open correctly in new tabs
  const normalizeUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const handleResumeParse = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setParsing(true);
    try {
      const res = await API.post("/jobs/parse-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.success) {
        const { name, skills, degree, cgpa, graduationYear, university, bio } = res.data;
        
        // Define updated user info combining existing values and parsed values
        const updatedInfo = {
          ...userInfo,
          name: name || userInfo.name,
          bio: bio || userInfo.bio,
          skills: skills && skills.length > 0 ? skills.join(", ") : userInfo.skills,
          degree: degree || userInfo.degree,
          cgpa: cgpa || userInfo.cgpa,
          graduationYear: graduationYear || userInfo.graduationYear,
          university: university || userInfo.university,
        };

        setUserInfo(updatedInfo);

        // Auto-save to MongoDB database
        const userId = localStorage.getItem("userId");
        const skillsArray = updatedInfo.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);

        const payload = {
          ...updatedInfo,
          skills: skillsArray,
        };

        await API.put(`/auth/profile/${userId}`, payload);
        alert("🎉 Resume parsed and profile auto-saved successfully!");
      } else {
        alert(`❌ Parsing failed: ${res.data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to parse resume: ${err.response?.data?.error || err.message}`);
    } finally {
      setParsing(false);
    }
  };

  const [userInfo, setUserInfo] = useState({
    name: "",
    bio: "",
    university: "",
    degree: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
    applications: 0,
    interviews: 0,
    offers: 0,
    leetcodeRating: "",
    questionsSolved: "",
    codechefRating: "",
    codeforcesRating: "",
    successRate: "0%",
    linkedin: "",
    github: "",
    leetcode: "",
    codeforces: "",
    profilePic: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await API.get(`/auth/profile/${userId}`);
        if (res.data) {
          const fetchedData = res.data;
          setUserInfo({
            name: fetchedData.name || "",
            bio: fetchedData.bio || "",
            university: fetchedData.university || "",
            degree: fetchedData.degree || "",
            graduationYear: fetchedData.graduationYear || "",
            cgpa: fetchedData.cgpa || "",
            skills: Array.isArray(fetchedData.skills)
              ? fetchedData.skills.join(", ")
              : fetchedData.skills || "",
            applications: fetchedData.applications || 0,
            interviews: fetchedData.interviews || 0,
            offers: fetchedData.offers || 0,
            leetcodeRating: fetchedData.leetcodeRating || "",
            questionsSolved: fetchedData.questionsSolved || "",
            codechefRating: fetchedData.codechefRating || "",
            codeforcesRating: fetchedData.codeforcesRating || "",
            successRate: fetchedData.successRate || "0%",
            linkedin: fetchedData.linkedin || "",
            github: fetchedData.github || "",
            leetcode: fetchedData.leetcode || "",
            codeforces: fetchedData.codeforces || "",
            profilePic: fetchedData.profilePic || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserInfo((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const skillsArray = userInfo.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const payload = {
        ...userInfo,
        skills: skillsArray,
      };

      await API.put(`/auth/profile/${userId}`, payload);
      alert("✅ Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save profile");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      }`}>
        <Navbar title="Profile" />

        <main className="flex-1 p-4 sm:p-6 mt-16 pb-12 max-w-4xl mx-auto w-full space-y-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              Developer Profile 👤
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Manage your academic credentials, competitive ratings, and professional handles.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border shadow-xl space-y-8 ${
              darkMode ? "bg-[#151D30] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {/* AI Resume Parser Widget */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 ${
                darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-2xl shrink-0">
                  📄
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-snug">AI Resume Parser</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Upload a PDF resume to instantly autofill your name, bio, and key skills.</p>
                </div>
              </div>
              <label
                className={`px-5 py-3 rounded-xl font-bold text-xs tracking-wider transition cursor-pointer shadow-md inline-block text-center w-full sm:w-auto ${
                  parsing
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-600/20"
                }`}
              >
                {parsing ? "Parsing Resume..." : "Upload Resume (PDF)"}
                {!parsing && <input type="file" accept="application/pdf" onChange={handleResumeParse} className="hidden" />}
              </label>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col items-center shrink-0">
                <img
                  src={userInfo.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile Photo"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-indigo-600 shadow-md"
                />

                <label
                  className="
                    mt-4
                    px-4 py-2
                    bg-indigo-600
                    hover:bg-indigo-700
                    rounded-xl
                    cursor-pointer
                    text-xs
                    font-bold
                    text-white
                    inline-block
                    transition
                    shadow-sm
                  "
                >
                  Edit Photo
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Name</label>
                  <input
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your Full Name"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Bio</label>
                  <textarea
                    value={userInfo.bio}
                    rows={2}
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        bio: e.target.value,
                      })
                    }
                    placeholder="Short description about yourself..."
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat title="Applications" value={userInfo.applications} darkMode={darkMode} />
              <Stat title="Interviews" value={userInfo.interviews} darkMode={darkMode} />
              <Stat title="Offers" value={userInfo.offers} darkMode={darkMode} />
              <Stat title="Success Rate" value={userInfo.successRate} darkMode={darkMode} />
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight">🚀 Skills</h3>
              <textarea
                value={userInfo.skills}
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    skills: e.target.value,
                  })
                }
                placeholder="React, Node.js, MongoDB, Java, C++..."
                className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {userInfo.skills
                  .split(",")
                  .filter((skill) => skill.trim())
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 px-3 py-1 rounded-xl text-xs font-semibold"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight">🎓 Education</h3>
              <div className={`p-5 rounded-2xl border space-y-4 ${darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Degree</label>
                    <input
                      value={userInfo.degree}
                      onChange={(e) => setUserInfo({ ...userInfo, degree: e.target.value })}
                      placeholder="e.g. B.Tech Computer Science"
                      className={`w-full p-3 rounded-xl border text-sm outline-none ${
                        darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">University</label>
                    <input
                      value={userInfo.university}
                      onChange={(e) => setUserInfo({ ...userInfo, university: e.target.value })}
                      placeholder="e.g. Stanford University"
                      className={`w-full p-3 rounded-xl border text-sm outline-none ${
                        darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Year Of Graduation</label>
                    <input
                      value={userInfo.graduationYear}
                      onChange={(e) => setUserInfo({ ...userInfo, graduationYear: e.target.value })}
                      placeholder="e.g. 2026"
                      className={`w-full p-3 rounded-xl border text-sm outline-none ${
                        darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Current CGPA</label>
                    <input
                      value={userInfo.cgpa}
                      onChange={(e) => setUserInfo({ ...userInfo, cgpa: e.target.value })}
                      placeholder="e.g. 9.2"
                      className={`w-full p-3 rounded-xl border text-sm outline-none ${
                        darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Competitive Programming */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight">🏆 Competitive Programming Ratings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">LeetCode Rating</label>
                  <input
                    value={userInfo.leetcodeRating}
                    onChange={(e) => setUserInfo({ ...userInfo, leetcodeRating: e.target.value })}
                    placeholder="e.g. 1950"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">DSA Questions Solved</label>
                  <input
                    value={userInfo.questionsSolved}
                    onChange={(e) => setUserInfo({ ...userInfo, questionsSolved: e.target.value })}
                    placeholder="e.g. 500"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">CodeChef Rating</label>
                  <input
                    value={userInfo.codechefRating}
                    onChange={(e) => setUserInfo({ ...userInfo, codechefRating: e.target.value })}
                    placeholder="e.g. 1850"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Codeforces Rating</label>
                  <input
                    value={userInfo.codeforcesRating}
                    onChange={(e) => setUserInfo({ ...userInfo, codeforcesRating: e.target.value })}
                    placeholder="e.g. 1600"
                    className={`w-full p-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Coding Profiles */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight">🔗 Coding & Professional Profiles</h3>
              <div className="space-y-3">
                {/* LinkedIn */}
                <div
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl border ${
                    darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="w-24 font-bold text-xs uppercase tracking-wider text-slate-400">LinkedIn</span>
                  <input
                    type="text"
                    placeholder="Paste LinkedIn Profile URL"
                    value={userInfo.linkedin}
                    onChange={(e) => setUserInfo({ ...userInfo, linkedin: e.target.value })}
                    className={`flex-1 p-2.5 rounded-lg border text-sm outline-none ${
                      darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}
                  />
                  {userInfo.linkedin && (
                    <a href={normalizeUrl(userInfo.linkedin)} target="_blank" rel="noreferrer" className="shrink-0">
                      <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition">
                        Visit
                      </button>
                    </a>
                  )}
                </div>

                {/* GitHub */}
                <div
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl border ${
                    darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="w-24 font-bold text-xs uppercase tracking-wider text-slate-400">GitHub</span>
                  <input
                    type="text"
                    placeholder="Paste GitHub Profile URL"
                    value={userInfo.github}
                    onChange={(e) => setUserInfo({ ...userInfo, github: e.target.value })}
                    className={`flex-1 p-2.5 rounded-lg border text-sm outline-none ${
                      darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}
                  />
                  {userInfo.github && (
                    <a href={normalizeUrl(userInfo.github)} target="_blank" rel="noreferrer" className="shrink-0">
                      <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition">
                        Visit
                      </button>
                    </a>
                  )}
                </div>

                {/* LeetCode */}
                <div
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl border ${
                    darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="w-24 font-bold text-xs uppercase tracking-wider text-slate-400">LeetCode</span>
                  <input
                    type="text"
                    placeholder="Paste LeetCode Profile URL"
                    value={userInfo.leetcode}
                    onChange={(e) => setUserInfo({ ...userInfo, leetcode: e.target.value })}
                    className={`flex-1 p-2.5 rounded-lg border text-sm outline-none ${
                      darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}
                  />
                  {userInfo.leetcode && (
                    <a href={normalizeUrl(userInfo.leetcode)} target="_blank" rel="noreferrer" className="shrink-0">
                      <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition">
                        Visit
                      </button>
                    </a>
                  )}
                </div>

                {/* Codeforces */}
                <div
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl border ${
                    darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="w-24 font-bold text-xs uppercase tracking-wider text-slate-400">Codeforces</span>
                  <input
                    type="text"
                    placeholder="Paste Codeforces Profile URL"
                    value={userInfo.codeforces}
                    onChange={(e) => setUserInfo({ ...userInfo, codeforces: e.target.value })}
                    className={`flex-1 p-2.5 rounded-lg border text-sm outline-none ${
                      darkMode ? "bg-[#151D30] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                    }`}
                  />
                  {userInfo.codeforces && (
                    <a href={normalizeUrl(userInfo.codeforces)} target="_blank" rel="noreferrer" className="shrink-0">
                      <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition">
                        Visit
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={saveUserInfo}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/25 transition"
              >
                Save All Profile Data
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({ title, value, darkMode }) {
  return (
    <div
      className={`p-4 rounded-2xl text-center border shadow-sm ${
        darkMode ? "bg-[#0B0F19] border-slate-800/80" : "bg-slate-50 border-slate-200"
      }`}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      <p className="text-xl font-extrabold mt-1.5">{value}</p>
    </div>
  );
}