"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type SupplierScoreChartProps = {
  ranking: {
    supplierId: string;
    supplierName: string;
    scores: { criteriaId: string; criteriaName: string; score: number }[];
    totalScore: number;
  }[];
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

export function SupplierScoreChart({ ranking }: SupplierScoreChartProps) {
  if (ranking.length === 0) return null;

  const allCriteriaNames = [
    ...new Set(ranking.flatMap((r) => r.scores.map((s) => s.criteriaName))),
  ];

  const chartData = ranking.map((r) => {
    const row: Record<string, string | number> = {
      name: r.supplierName,
    };
    for (const score of r.scores) {
      const key = score.criteriaName;
      row[key] = Number((score.score * 100).toFixed(2));
    }
    return row;
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-base font-semibold text-teal-800 text-center">
        Skor Pemasok per Kriteria
      </h3>
      <ResponsiveContainer
        width="100%"
        height={Math.max(250, ranking.length * 60)}
      >
        <BarChart
          data={chartData}
          layout="vertical"
          // margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
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
            width={120}
          />
          <Tooltip
            formatter={(value) => [`${value}%`]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          {allCriteriaNames.map((name, index) => (
            <Bar
              key={name}
              dataKey={name}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
              radius={
                index === allCriteriaNames.length - 1
                  ? [4, 4, 0, 0]
                  : [0, 0, 0, 0]
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
