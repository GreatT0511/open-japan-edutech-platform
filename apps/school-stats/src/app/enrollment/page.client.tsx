"use client";

import { Card } from "@ojetp/ui";
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

const LEVEL_COLORS: Record<string, string> = {
  ELEMENTARY: "var(--color-primary-500)",
  JUNIOR_HIGH: "var(--color-secondary-500)",
  HIGH_SCHOOL: "var(--color-accent-500)",
  SPECIAL_NEEDS: "var(--color-danger-500)",
  KINDERGARTEN: "#8b5cf6",
  COMBINED: "#06b6d4",
};

interface EnrollmentChartsProps {
  overallTrends: { year: number; studentCount: number }[];
  byLevelTrends: Record<string, number>[];
  levelLabels: Record<string, string>;
}

export function EnrollmentCharts({
  overallTrends,
  byLevelTrends,
  levelLabels,
}: EnrollmentChartsProps) {
  const levelKeys = Object.keys(LEVEL_COLORS);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">
          児童生徒数 全体推移
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={overallTrends}>
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
              stroke="var(--color-primary-600)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">
          学校種別ごとの推移
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={byLevelTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                levelLabels[name] ?? name,
              ]}
              labelFormatter={(label: string) => `${label}年`}
            />
            <Legend formatter={(value: string) => levelLabels[value] ?? value} />
            {levelKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={LEVEL_COLORS[key]}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
