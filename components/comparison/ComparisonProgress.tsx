"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

type ComparisonProgressProps = {
  totalPairs: number;
  filledPairs: number;
};

export function ComparisonProgress({
  totalPairs,
  filledPairs,
}: ComparisonProgressProps) {
  const allFilled = filledPairs >= totalPairs;
  const percentage =
    totalPairs > 0 ? Math.round((filledPairs / totalPairs) * 100) : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {allFilled ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
          <span className={allFilled ? "text-green-700" : "text-amber-700"}>
            {allFilled
              ? "Semua perbandingan telah diisi"
              : `${filledPairs} dari ${totalPairs} perbandingan terisi`}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-600">{percentage}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            allFilled ? "bg-green-500" : "bg-amber-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
