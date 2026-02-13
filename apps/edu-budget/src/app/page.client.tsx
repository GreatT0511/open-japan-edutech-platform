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

interface BudgetByCategoryItem {
  category: string;
  amount: number;
}

interface BudgetTrendItem {
  year: number;
  amount: number;
}

interface DashboardChartsProps {
  budgetByCategory: BudgetByCategoryItem[];
  budgetTrends: BudgetTrendItem[];
}

export function DashboardCharts({ budgetByCategory, budgetTrends }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">分野別予算配分</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={budgetByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} 億円`}
              labelFormatter={(label: string) => `分野: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="amount"
              name="予算額（億円）"
              fill="var(--color-primary-500)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">予算総額の推移</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={budgetTrends}>
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
