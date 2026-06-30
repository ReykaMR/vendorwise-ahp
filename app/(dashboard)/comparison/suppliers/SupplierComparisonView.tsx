"use client";

import { useCallback, useState } from "react";
import { SupplierMatrix } from "@/components/comparison/SupplierMatrix";
import { getSupplierMatrix } from "@/app/actions/comparison.actions";
import { Loader2 } from "lucide-react";

type SupplierMatrixData = {
  criteriaId: string;
  criteriaName: string;
  suppliers: { id: string; name: string }[];
  cells: {
    rowId: string;
    colId: string;
    value: number | null;
    isReadonly: boolean;
  }[][];
};

type SupplierComparisonViewProps = {
  allCriteria: { id: string; name: string }[];
  initialData: SupplierMatrixData | null;
};

export function SupplierComparisonView({
  allCriteria,
  initialData,
}: SupplierComparisonViewProps) {
  const [matrixData, setMatrixData] = useState<SupplierMatrixData | null>(
    initialData,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleCriteriaChange = useCallback(
    async (criteriaId: string) => {
      setIsLoading(true);
      const result = await getSupplierMatrix(criteriaId);
      setIsLoading(false);

      if (result.success && result.data) {
        setMatrixData(result.data);
      }
    },
    [],
  );

  if (allCriteria.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
        Belum ada kriteria utama. Silakan tambah kriteria terlebih dahulu.
      </div>
    );
  }

  if (!matrixData || allCriteria.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
        Belum ada data. Pastikan Anda telah menambahkan kriteria dan pemasok.
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-white/60">
          <div className="flex items-center gap-2 text-teal-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Memuat data...</span>
          </div>
        </div>
      )}
      <SupplierMatrix
        key={matrixData.criteriaId}
        allCriteria={allCriteria}
        initialData={matrixData}
        onCriteriaChange={handleCriteriaChange}
      />
    </div>
  );
}
