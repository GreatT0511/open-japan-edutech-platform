"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RecruitmentData {
  year: number;
  schoolLevel: string;
  applicants: number | null;
  hires: number | null;
  ratio: number | null;
}

export function RecruitmentCharts({ data }: { data: RecruitmentData[] }) {
  const schoolLevelLabels: Record<string, string> = {
    ELEMENTARY: "小学校",
    JUNIOR_HIGH: "中学校",
    HIGH_SCHOOL: "高等学校",
  };

  const years = [...new Set(data.map((d) => d.year))].sort();
  const levels = [...new Set(data.map((d) => d.schoolLevel))];
  const colors = ["#2563EB", "#059669", "#D97706"];

  const chartData = years.map((year) => {
    const row: Record<string, number | null> = { year };
    for (const level of levels) {
      const entry = data.find((d) => d.year === year && d.schoolLevel === level);
      row[schoolLevelLabels[level] || level] = entry?.ratio ?? null;
    }
    return row;
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">採用倍率の推移</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: "倍率", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          {levels.map((level, i) => (
            <Line
              key={level}
              type="monotone"
              dataKey={schoolLevelLabels[level] || level}
              stroke={colors[i]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
