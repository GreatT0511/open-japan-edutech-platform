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

const CATEGORY_COLORS: Record<string, string> = {
  ELEMENTARY_SECONDARY: "var(--color-primary-500)",
  HIGHER_EDUCATION: "var(--color-secondary-500)",
  SCIENCE_TECHNOLOGY: "var(--color-accent-500)",
  SPORTS: "#8b5cf6",
  CULTURE: "#ec4899",
  SCHOLARSHIP: "#06b6d4",
  FACILITY: "#84cc16",
  LIFELONG_LEARNING: "#f97316",
  OTHER: "var(--color-neutral-400)",
};

interface TrendChartsProps {
  overallTrends: { year: number; amount: number }[];
  byCategoryTrends: Record<string, number>[];
  categoryLabels: Record<string, string>;
}

export function TrendCharts({ overallTrends, byCategoryTrends, categoryLabels }: TrendChartsProps) {
  const categoryKeys = Object.keys(CATEGORY_COLORS);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">予算総額の推移</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={overallTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} 億円`}
              labelFormatter={(label: string) => `${label}年度`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              name="総予算額（億円）"
              stroke="var(--color-primary-600)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">分野別予算の推移</h2>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={byCategoryTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} 億円`,
                categoryLabels[name] ?? name,
              ]}
              labelFormatter={(label: string) => `${label}年度`}
            />
            <Legend formatter={(value: string) => categoryLabels[value] ?? value} />
            {categoryKeys.map((key) => (
              <Bar key={key} dataKey={key} stackId="category" fill={CATEGORY_COLORS[key]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
