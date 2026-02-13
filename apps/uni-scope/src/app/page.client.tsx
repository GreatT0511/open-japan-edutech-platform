"use client";

import { Card } from "@ojetp/ui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardChartsProps {
  typeDistribution: { name: string; value: number }[];
  tuitionComparison: { name: string; tuition: number }[];
}

const PIE_COLORS = [
  "var(--color-primary-500)",
  "var(--color-secondary-500)",
  "var(--color-accent-500)",
];

export function DashboardCharts({ typeDistribution, tuitionComparison }: DashboardChartsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">大学種別構成</h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={typeDistribution}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine
            >
              {typeDistribution.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString("ja-JP")}校`, "大学数"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">種別平均学費比較</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={tuitionComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 14 }} />
            <YAxis
              tickFormatter={(v: number) => `${(v / 10000).toLocaleString("ja-JP")}万`}
              tick={{ fontSize: 12 }}
              label={{
                value: "年間学費（円）",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12 },
              }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString("ja-JP")}円`, "年間学費"]}
            />
            <Bar dataKey="tuition" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
