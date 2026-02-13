"use client";

import { Card } from "@ojetp/ui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ComparisonItem {
  country: string;
  countryCode: string;
  eduSpendingGdpPct: number | null;
  publicSpendingPct: number | null;
  primaryPupilTeacher: number | null;
}

interface JapanTrendItem {
  year: number;
  eduSpendingGdpPct: number | null;
  publicSpendingPct: number | null;
}

interface OecdChartsProps {
  comparisonData: ComparisonItem[];
  japanTrend: JapanTrendItem[];
}

export function OecdCharts({ comparisonData, japanTrend }: OecdChartsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">
          教育費対GDP比（国別比較）
        </h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={comparisonData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="%" />
            <YAxis dataKey="country" type="category" tick={{ fontSize: 11 }} width={80} />
            <Tooltip
              formatter={(value: number) => `${value?.toFixed(1)}%`}
              labelFormatter={(label: string) => label}
            />
            <Legend />
            <Bar dataKey="eduSpendingGdpPct" name="教育費対GDP比 (%)">
              {comparisonData.map((entry) => (
                <Cell
                  key={entry.countryCode}
                  fill={
                    entry.countryCode === "JPN"
                      ? "var(--color-danger-500)"
                      : "var(--color-primary-400)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">
          日本の教育支出推移
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={japanTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis unit="%" />
            <Tooltip
              formatter={(value: number, name: string) => [`${value?.toFixed(1)}%`, name]}
              labelFormatter={(label: string) => `${label}年`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="eduSpendingGdpPct"
              name="教育費対GDP比"
              stroke="var(--color-primary-500)"
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="publicSpendingPct"
              name="公的支出割合"
              stroke="var(--color-secondary-500)"
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
