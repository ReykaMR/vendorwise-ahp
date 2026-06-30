"use client";

import { useCallback, useState } from "react";
import { calculateAHP } from "@/app/actions/ahp.actions";
import type { AHPResult } from "@/services/ahp.service";
import { ConsistencyAlert } from "@/components/results/ConsistencyAlert";
import { CriteriaWeightChart } from "@/components/results/CriteriaWeightChart";
import { SupplierScoreChart } from "@/components/results/SupplierScoreChart";
import { ResultTable } from "@/components/results/ResultTable";
import { Button } from "@/components/ui/button";
import { Loader2, Calculator, AlertCircle } from "lucide-react";

type ResultsClientProps = {
  initialResult: AHPResult | null;
  initialError: string | null;
};

export function ResultsClient({
  initialResult,
  initialError,
}: ResultsClientProps) {
  const [result, setResult] = useState<AHPResult | null>(initialResult);
  const [error, setError] = useState<string | null>(initialError);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = useCallback(async () => {
    setCalculating(true);
    setError(null);
    const res = await calculateAHP();
    setCalculating(false);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || "Gagal menghitung AHP");
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Hasil AHP</h1>
          <p className="mt-1 text-sm text-gray-500">
            Peringkat pemasok berdasarkan perhitungan Analytic Hierarchy Process
          </p>
        </div>
        <Button
          onClick={handleCalculate}
          disabled={calculating}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {calculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menghitung...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Hitung AHP
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {result && !result.success && result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              {w}
            </div>
          ))}
        </div>
      )}

      {result?.success && (
        <>
          {result.warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              {w}
            </div>
          ))}

          {result.criteriaResult && (
            <ConsistencyAlert
              cr={result.criteriaResult.consistency.cr}
              isConsistent={result.criteriaResult.consistency.isConsistent}
              label="Kriteria"
            />
          )}

          {result.supplierResults.map((sr) => (
            <ConsistencyAlert
              key={sr.criteriaId}
              cr={sr.consistency.cr}
              isConsistent={sr.consistency.isConsistent}
              label={`Pemasok (${sr.criteriaName})`}
            />
          ))}

          <div className="grid gap-6 lg:grid-cols-2">
            {result.criteriaResult && (
              <CriteriaWeightChart data={result.criteriaResult.items} />
            )}
            {result.ranking.length > 0 && (
              <SupplierScoreChart ranking={result.ranking} />
            )}
          </div>

          {result.ranking.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-teal-800">
                Peringkat Akhir Pemasok
              </h2>
              <ResultTable ranking={result.ranking} />
            </div>
          )}

          {result.criteriaResult && result.ranking.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
              {result.supplierResults.length === 0
                ? "Belum ada data perbandingan pemasok. Silakan isi perbandingan berpasangan pemasok terlebih dahulu."
                : "Data perbandingan pemasok belum mencakup semua kriteria. Pastikan setiap kriteria memiliki perbandingan pemasok."}
            </div>
          )}

          {result.criteriaResult &&
            result.criteriaResult.items.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-2 text-base font-semibold text-teal-800">
                  Detail Bobot Prioritas Kriteria
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-600">
                          Kriteria
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">
                          Bobot
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.criteriaResult.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-3 py-2 text-gray-800">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-teal-700">
                            {(item.priority * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {result.supplierResults.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-base font-semibold text-teal-800">
                Detail Bobot Prioritas Pemasok per Kriteria
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Kriteria
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">
                        Pemasok
                      </th>
                      <th className="px-3 py-2 text-right font-medium text-gray-600">
                        Bobot
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.supplierResults.map((sr) =>
                      sr.items.map((item, idx) => (
                        <tr
                          key={`${sr.criteriaId}-${item.id}`}
                          className="border-b"
                        >
                          <td className="px-3 py-2 text-gray-800">
                            {idx === 0 ? sr.criteriaName : ""}
                          </td>
                          <td className="px-3 py-2 text-gray-800">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-teal-700">
                            {(item.priority * 100).toFixed(2)}%
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
