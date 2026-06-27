import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function Chart({ jobs }) {
  const data = [
    { name: "Applied", value: jobs.filter(j => j.status === "Applied").length },
    { name: "Interview", value: jobs.filter(j => j.status === "Interview").length },
    { name: "Rejected", value: jobs.filter(j => j.status === "Rejected").length },
    { name: "Offer", value: jobs.filter(j => j.status === "Offer").length }
  ];

  const COLORS = ["#3498db", "#f39c12", "#e74c3c", "#2ecc71"];

  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value">
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}