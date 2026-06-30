"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MatrixCell } from "@/components/comparison/MatrixCell";
import { saveSupplierCell } from "@/app/actions/comparison.actions";
import { Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { CriteriaNavigator } from "@/components/comparison/CriteriaNavigator";

type SupplierItem = {
  id: string;
  name: string;
};

type MatrixCellData = {
  rowId: string;
  colId: string;
  value: number | null;
  isReadonly: boolean;
};

type SupplierMatrixData = {
  criteriaId: string;
  criteriaName: string;
  suppliers: SupplierItem[];
  cells: MatrixCellData[][];
};

type SupplierMatrixProps = {
  allCriteria: { id: string; name: string }[];
  initialData: SupplierMatrixData;
  onCriteriaChange: (criteriaId: string) => void;
};

export function SupplierMatrix({
  allCriteria,
  initialData,
  onCriteriaChange,
}: SupplierMatrixProps) {
  const [matrix, setMatrix] = useState<MatrixCellData[][]>(initialData.cells);
  const [loading, setLoading] = useState(false);
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const criteriaName = initialData.criteriaName;
  const suppliers = initialData.suppliers;
  const selectedCriteriaId = initialData.criteriaId;

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

      const rowId = suppliers[rowIdx].id;
      const colId = suppliers[colIdx].id;
      const timerKey = `${selectedCriteriaId}:${rowId}:${colId}`;

      const existing = debounceTimers.current.get(timerKey);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(async () => {
        setLoading(true);
        const result = await saveSupplierCell(
          selectedCriteriaId,
          rowId,
          colId,
          newValue,
        );
        setLoading(false);

        if (result.success) {
          toast.success("Tersimpan");
        } else {
          toast.error(result.error || "Gagal menyimpan");
        }
      }, 800);

      debounceTimers.current.set(timerKey, timer);
    },
    [suppliers, selectedCriteriaId],
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

  const handleCriteriaSelect = useCallback(
    (criteriaId: string) => {
      onCriteriaChange(criteriaId);
    },
    [onCriteriaChange],
  );

  const n = suppliers.length;

  if (n < 2) {
    return (
      <div className="space-y-4">
        <CriteriaNavigator
          criteria={allCriteria}
          selectedId={selectedCriteriaId}
          onSelect={handleCriteriaSelect}
        />
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          <Info className="h-5 w-5 shrink-0" />
          <span>
            Minimal 2 pemasok diperlukan untuk melakukan perbandingan
            berpasangan.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CriteriaNavigator
        criteria={allCriteria}
        selectedId={selectedCriteriaId}
        onSelect={handleCriteriaSelect}
      />

      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500">
          Isi perbandingan berpasangan antar pemasok untuk kriteria{" "}
          <span className="font-semibold text-teal-700">{criteriaName}</span>.
        </p>
        {loading && (
          <div className="flex items-center gap-1 text-sm text-teal-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Menyimpan...
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[400px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-r bg-teal-50 px-3 py-2 text-left font-semibold text-teal-800">
                Pemasok
              </th>
              {suppliers.map((s) => (
                <th
                  key={s.id}
                  className="border-b bg-teal-50 px-3 py-2 text-center font-semibold text-teal-800"
                >
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={suppliers[i].id}>
                <td className="sticky left-0 z-10 border-b border-r bg-white px-3 py-2 font-medium text-gray-700">
                  {suppliers[i].name}
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
