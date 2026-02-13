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

interface SchoolsByLevelItem {
  level: string;
  schoolCount: number;
  studentCount: number;
}

interface StudentTrendItem {
  year: number;
  studentCount: number;
}

interface DashboardChartsProps {
  schoolsByLevel: SchoolsByLevelItem[];
  studentTrends: StudentTrendItem[];
}

export function DashboardCharts({ schoolsByLevel, studentTrends }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">
          学校種別ごとの学校数
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={schoolsByLevel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              labelFormatter={(label: string) => `学校種別: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="schoolCount"
              name="学校数"
              fill="var(--color-primary-500)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">児童生徒数の推移</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={studentTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              labelFormatter={(label: string) => `${label}年`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="studentCount"
              name="児童生徒数"
              stroke="var(--color-secondary-500)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
