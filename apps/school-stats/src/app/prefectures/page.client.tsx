"use client";

import { Card } from "@ojetp/ui";
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

interface PrefectureData {
  prefectureCode: string;
  prefectureName: string;
  totalSchools: number;
  totalStudents: number;
}

interface PrefectureChartsProps {
  data: PrefectureData[];
}

export function PrefectureCharts({ data }: PrefectureChartsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">
          都道府県別 学校数
        </h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="prefectureName" type="category" tick={{ fontSize: 11 }} width={70} />
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              labelFormatter={(label: string) => label}
            />
            <Legend />
            <Bar
              dataKey="totalSchools"
              name="学校数"
              fill="var(--color-primary-500)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-neutral-800)]">
          都道府県別 児童生徒数
        </h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="prefectureName" type="category" tick={{ fontSize: 11 }} width={70} />
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              labelFormatter={(label: string) => label}
            />
            <Legend />
            <Bar
              dataKey="totalStudents"
              name="児童生徒数"
              fill="var(--color-secondary-500)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
