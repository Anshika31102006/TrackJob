import { useEffect, useState } from "react";
import API from "../services/api";

export default function JobsTable() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">
        All Applications 📋
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-white bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-white/5 border-b border-white/20">
              <th className="p-4 text-white font-semibold border-r border-white/20">
                Company
              </th>
              <th className="p-4 text-white font-semibold border-r border-white/20">
                Role
              </th>
              <th className="p-4 text-white font-semibold border-r border-white/20">
                Status
              </th>
              <th className="p-4 text-white font-semibold border-r border-white/20">
                OA
              </th>
              <th className="p-4 text-white font-semibold border-r border-white/20">
                Interview
              </th>
              <th className="p-4 text-white font-semibold">
                Resume
              </th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr
                key={job._id}
                className="border-b border-white/10 hover:bg-white/10 transition"
              >
                <td className="p-4 text-white border-r border-white/20">
                  {job.company}
                </td>

                <td className="p-4 text-white border-r border-white/20">
                  {job.role}
                </td>

                <td className="p-4 text-white border-r border-white/20">
                  {job.status}
                </td>

                <td className="p-4 text-white border-r border-white/20">
                  {job.oaCleared ? "✅" : "❌"}
                </td>

                <td className="p-4 text-white border-r border-white/20">
                  {job.interviewCall ? "📞" : "—"}
                </td>

                <td className="p-4 text-white">
                  {job.resume && (
                    <a
                      href={`http://localhost:5001/uploads/${job.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 hover:text-cyan-200 underline"
                    >
                      View Resume
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}