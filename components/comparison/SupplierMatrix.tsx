"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MatrixCell } from "@/components/comparison/MatrixCell";
import { saveSupplierCell } from "@/app/actions/comparison.actions";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { CriteriaNavigator } from "@/components/comparison/CriteriaNavigator";
import { ComparisonProgress } from "@/components/comparison/ComparisonProgress";
import { ConsistencyBadge } from "@/components/comparison/ConsistencyBadge";
import { SaveIndicator } from "@/components/comparison/SaveIndicator";

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

function findExtremes(
  cells: MatrixCellData[][],
): { minVal: number; maxVal: number } | null {
  let minVal = Infinity;
  let maxVal = -Infinity;
  let found = false;
  for (const row of cells) {
    for (const c of row) {
      if (!c.isReadonly && c.value !== null) {
        if (c.value < minVal) minVal = c.value;
        if (c.value > maxVal) maxVal = c.value;
        found = true;
      }
    }
  }
  return found ? { minVal, maxVal } : null;
}

function isBest(
  cell: MatrixCellData,
  extremes: { minVal: number; maxVal: number } | null,
): boolean {
  if (!extremes || cell.value === null || cell.isReadonly) return false;
  return Math.abs(cell.value - extremes.maxVal) < 1e-10;
}

function isWorst(
  cell: MatrixCellData,
  extremes: { minVal: number; maxVal: number } | null,
): boolean {
  if (!extremes || cell.value === null || cell.isReadonly) return false;
  return (
    Math.abs(cell.value - extremes.minVal) < 1e-10 &&
    Math.abs(extremes.minVal - extremes.maxVal) > 1e-10
  );
}

export function SupplierMatrix({
  allCriteria,
  initialData,
  onCriteriaChange,
}: SupplierMatrixProps) {
  const [matrix, setMatrix] = useState<MatrixCellData[][]>(initialData.cells);
  const [loading, setLoading] = useState(false);
  const [saveVersion, setSaveVersion] = useState(0);
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const tableRef = useRef<HTMLDivElement>(null);

  const criteriaName = initialData.criteriaName;
  const suppliers = initialData.suppliers;
  const selectedCriteriaId = initialData.criteriaId;

  const extremes = findExtremes(matrix);

  const handleChange = useCallback(
    (rowIdx: number, colIdx: number, newValue: number) => {
      setMatrix((prev) => {
        const next = prev.map((r) => r.map((c) => ({ ...c })));
        next[rowIdx][colIdx].value = newValue;

        const reciprocal = Math.abs(newValue) < 1e-10 ? null : 1 / newValue;
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
          setSaveVersion((v) => v + 1);
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

  useEffect(() => {
    const wrapper = tableRef.current;
    if (!wrapper) return;
    const firstEditable = wrapper.querySelector<HTMLButtonElement>(
      'td:not(.readonly-cell) button[data-slot="select-trigger"]',
    );
    firstEditable?.focus({ preventScroll: true });
  }, [selectedCriteriaId]);

  const handleCriteriaSelect = useCallback(
    (criteriaId: string) => {
      onCriteriaChange(criteriaId);
    },
    [onCriteriaChange],
  );

  const n = suppliers.length;
  const totalPairs = (n * (n - 1)) / 2;
  const filledPairs = matrix
    .flatMap((row) => row.filter((cell) => !cell.isReadonly))
    .filter((cell) => cell.value !== null).length;

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
        <SaveIndicator saving={loading} saveVersion={saveVersion} />
      </div>

      <ComparisonProgress totalPairs={totalPairs} filledPairs={filledPairs} />

      <ConsistencyBadge
        type="supplier"
        criteriaId={selectedCriteriaId}
        saveVersion={saveVersion}
      />

      <p className="text-xs text-gray-400">
        Gunakan{" "}
        <kbd className="rounded border bg-gray-100 px-1 font-mono text-xs">
          Tab
        </kbd>{" "}
        untuk navigasi antar sel.
        {extremes && (
          <span className="ml-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-green-200 align-middle" />{" "}
            nilai tertinggi &middot;{" "}
            <span className="inline-block h-2 w-2 rounded-sm bg-red-200 align-middle" />{" "}
            nilai terendah
          </span>
        )}
      </p>

      <div
        className="overflow-x-auto rounded-lg border border-gray-200"
        ref={tableRef}
      >
        <table className="w-full min-w-100 border-collapse text-sm">
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
                {row.map((cell, j) => {
                  let highlightClass = "";
                  if (!cell.isReadonly) {
                    if (isBest(cell, extremes)) highlightClass = "bg-green-50";
                    else if (isWorst(cell, extremes))
                      highlightClass = "bg-red-50";
                  }

                  return (
                    <td
                      key={`${cell.rowId}-${cell.colId}`}
                      className={`border-b px-1 py-1 text-center ${
                        cell.isReadonly
                          ? "bg-gray-50/50 readonly-cell"
                          : highlightClass || "bg-white"
                      }`}
                    >
                      <MatrixCell
                        value={cell.value}
                        isReadonly={cell.isReadonly}
                        onChange={(newVal) => handleChange(i, j, newVal)}
                      />
                    </td>
                  );
                })}
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
          <div className="md:col-span-2">1/2, 1/4, 1/6, 1/8 = Nilai antara</div>
        </div>
      </details>
    </div>
  );
}
