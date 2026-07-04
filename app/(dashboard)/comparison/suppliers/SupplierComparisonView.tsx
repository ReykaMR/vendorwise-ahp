"use client";

import { useCallback, useState } from "react";
import { SupplierMatrix } from "@/components/comparison/SupplierMatrix";
import { getSupplierMatrix } from "@/app/actions/comparison.actions";
import { Skeleton } from "@/components/ui/skeleton";

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

  const handleCriteriaChange = useCallback(async (criteriaId: string) => {
    setIsLoading(true);
    const result = await getSupplierMatrix(criteriaId);
    setIsLoading(false);

    if (result.success && result.data) {
      setMatrixData(result.data);
    }
  }, []);

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
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            {allCriteria.map((c) => (
              <Skeleton key={c.id} className="h-9 w-28 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-5 w-56" />
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-100 border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-r bg-gray-100 px-3 py-3">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  {[1, 2, 3].map((i) => (
                    <th key={i} className="border-b bg-gray-100 px-3 py-3">
                      <Skeleton className="mx-auto h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((row) => (
                  <tr key={row}>
                    <td className="border-b border-r bg-white px-3 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    {[1, 2, 3].map((col) => (
                      <td key={col} className="border-b bg-white px-3 py-3">
                        <Skeleton className="mx-auto h-8 w-16 rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <SupplierMatrix
          key={matrixData.criteriaId}
          allCriteria={allCriteria}
          initialData={matrixData}
          onCriteriaChange={handleCriteriaChange}
        />
      )}
    </div>
  );
}
