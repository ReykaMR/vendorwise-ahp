"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type CriteriaWeightChartProps = {
  data: { id: string; name: string; priority: number }[];
};

const COLORS = [
  "#0d9488",
  "#0891b2",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#65a30d",
];

export function CriteriaWeightChart({ data }: CriteriaWeightChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map((item) => ({
    name: item.name,
    weight: Number((item.priority * 100).toFixed(2)),
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-base font-semibold text-teal-800 text-center">
        Bobot Prioritas Kriteria
      </h3>
      <ResponsiveContainer
        width="100%"
        height={Math.max(200, data.length * 50)}
      >
        <BarChart
          data={chartData}
          layout="vertical"
          // margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `${v}%`}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            width={100}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Bobot"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
