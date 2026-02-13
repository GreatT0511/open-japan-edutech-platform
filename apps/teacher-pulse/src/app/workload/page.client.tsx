"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WorkloadData {
  year: number;
  schoolLevel: string;
  total: number | null;
  teaching: number | null;
  admin: number | null;
  source: string | null;
}

export function WorkloadCharts({ data }: { data: WorkloadData[] }) {
  const schoolLevelLabels: Record<string, string> = {
    ELEMENTARY: "小学校",
    JUNIOR_HIGH: "中学校",
    HIGH_SCHOOL: "高等学校",
  };

  const chartData = data.map((d) => ({
    label: `${d.year} ${schoolLevelLabels[d.schoolLevel] || d.schoolLevel}`,
    授業: d.teaching,
    事務: d.admin,
    合計: d.total,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">週間勤務時間の推移</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" angle={-30} textAnchor="end" height={80} fontSize={12} />
          <YAxis label={{ value: "時間/週", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="授業" fill="#2563EB" />
          <Bar dataKey="事務" fill="#059669" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
