"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MatrixCell } from "@/components/comparison/MatrixCell";
import { saveCriteriaCell } from "@/app/actions/comparison.actions";
import { Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { ComparisonProgress } from "@/components/comparison/ComparisonProgress";

type CriteriaItem = {
  id: string;
  name: string;
};

type MatrixCellData = {
  rowId: string;
  colId: string;
  value: number | null;
  isReadonly: boolean;
};

type CriteriaMatrixData = {
  criteria: CriteriaItem[];
  cells: MatrixCellData[][];
};

type CriteriaMatrixProps = {
  initialData: CriteriaMatrixData;
};

export function CriteriaMatrix({ initialData }: CriteriaMatrixProps) {
  const [matrix, setMatrix] = useState<MatrixCellData[][]>(
    initialData.cells,
  );
  const [loading, setLoading] = useState(false);
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const handleChange = useCallback(
    (rowIdx: number, colIdx: number, newValue: number) => {
      setMatrix((prev) => {
        const next = prev.map((r) => r.map((c) => ({ ...c })));
        next[rowIdx][colIdx].value = newValue;

        const reciprocal =
          Math.abs(newValue) < 1e-10 ? null : 1 / newValue;
        if (reciprocal !== null) {
          next[colIdx][rowIdx].value = reciprocal;
        }

        return next;
      });

      const rowId = initialData.criteria[rowIdx].id;
      const colId = initialData.criteria[colIdx].id;
      const timerKey = `${rowId}:${colId}`;

      const existing = debounceTimers.current.get(timerKey);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(async () => {
        setLoading(true);
        const result = await saveCriteriaCell(rowId, colId, newValue);
        setLoading(false);

        if (result.success) {
          toast.success("Tersimpan");
        } else {
          toast.error(result.error || "Gagal menyimpan");
        }
      }, 800);

      debounceTimers.current.set(timerKey, timer);
    },
    [initialData.criteria],
  );

  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  const n = initialData.criteria.length;
  const totalPairs = (n * (n - 1)) / 2;
  const filledPairs = matrix
    .flatMap((row) => row.filter((cell) => !cell.isReadonly))
    .filter((cell) => cell.value !== null).length;

  if (n < 2) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
        <Info className="h-5 w-5 shrink-0" />
        <span>
          Minimal 2 kriteria utama diperlukan untuk melakukan perbandingan
          berpasangan.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500">
          Isi perbandingan berpasangan antar kriteria menggunakan skala Saaty
          1–9. Hanya sel di atas diagonal yang dapat diedit.
        </p>
        {loading && (
          <div className="flex items-center gap-1 text-sm text-teal-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Menyimpan...
          </div>
        )}
      </div>

      <ComparisonProgress totalPairs={totalPairs} filledPairs={filledPairs} />

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[400px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-r bg-teal-50 px-3 py-2 text-left font-semibold text-teal-800">
                Kriteria
              </th>
              {initialData.criteria.map((c) => (
                <th
                  key={c.id}
                  className="border-b bg-teal-50 px-3 py-2 text-center font-semibold text-teal-800"
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={initialData.criteria[i].id}>
                <td className="sticky left-0 z-10 border-b border-r bg-white px-3 py-2 font-medium text-gray-700">
                  {initialData.criteria[i].name}
                </td>
                {row.map((cell, j) => (
                  <td
                    key={`${cell.rowId}-${cell.colId}`}
                    className={`border-b px-1 py-1 text-center ${
                      !cell.isReadonly ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <MatrixCell
                      value={cell.value}
                      isReadonly={cell.isReadonly}
                      onChange={(newVal) => handleChange(i, j, newVal)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <summary className="cursor-pointer text-sm font-medium text-gray-600">
          Legenda Skala Saaty
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500 md:grid-cols-3">
          <div>1 = Sama penting</div>
          <div>3 = Sedang lebih penting</div>
          <div>5 = Kuat lebih penting</div>
          <div>7 = Sangat kuat lebih penting</div>
          <div>9 = Ekstrem lebih penting</div>
          <div>2, 4, 6, 8 = Nilai antara</div>
          <div>1/3 = Sedang kurang penting</div>
          <div>1/5 = Kuat kurang penting</div>
          <div>1/7 = Sangat kuat kurang penting</div>
          <div>1/9 = Ekstrem kurang penting</div>
          <div className="md:col-span-2">
            1/2, 1/4, 1/6, 1/8 = Nilai antara
          </div>
        </div>
      </details>
    </div>
  );
}
