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

const ISSUE_COLORS: Record<string, string> = {
  TRUANCY: "var(--color-primary-500)",
  BULLYING: "var(--color-danger-500)",
  VIOLENCE: "var(--color-accent-500)",
  DROPOUT: "var(--color-neutral-500)",
};

interface IssueChartsProps {
  trendData: Record<string, number>[];
  issueTypeLabels: Record<string, string>;
}

export function IssueCharts({ trendData, issueTypeLabels }: IssueChartsProps) {
  const issueKeys = Object.keys(ISSUE_COLORS);

  return (
    <Card>
      <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">課題件数の年次推移</h2>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              issueTypeLabels[name] ?? name,
            ]}
            labelFormatter={(label: string) => `${label}年`}
          />
          <Legend formatter={(value: string) => issueTypeLabels[value] ?? value} />
          {issueKeys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={ISSUE_COLORS[key]}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
