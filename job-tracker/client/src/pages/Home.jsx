import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center">

      <h1 className="text-5xl font-bold mb-4">Job Tracker 🚀</h1>
      <p className="mb-8 text-lg">Track applications. Analyze progress. Get hired.</p>

      <button
        onClick={() => navigate("/login")}
        className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        Get Started
      </button>

    </div>
  );
}