"use client";

import { Card } from "@ojetp/ui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardChartsProps {
  teachersByLevel: { name: string; value: number }[];
  recruitmentTrends: { year: number; ratio: number }[];
}

export function DashboardCharts({ teachersByLevel, recruitmentTrends }: DashboardChartsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">学校種別教員数</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={teachersByLevel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(v: number) => v.toLocaleString("ja-JP")}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value: number) => [value.toLocaleString("ja-JP"), "教員数"]} />
            <Bar dataKey="value" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">採用倍率の推移</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={recruitmentTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "倍率",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12 },
              }}
            />
            <Tooltip formatter={(value: number) => [`${value}倍`, "採用倍率"]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="ratio"
              name="採用倍率"
              stroke="var(--color-secondary-500)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
