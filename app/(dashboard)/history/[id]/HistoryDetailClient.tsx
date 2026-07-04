"use client";

import { ArrowLeft, Calendar, Database } from "lucide-react";
import Link from "next/link";
import { ConsistencyAlert } from "@/components/results/ConsistencyAlert";
import { CriteriaWeightChart } from "@/components/results/CriteriaWeightChart";
import { SupplierScoreChart } from "@/components/results/SupplierScoreChart";
import { ResultTable } from "@/components/results/ResultTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HistoryDetailProps = {
  id: string;
  label: string;
  createdAt: Date;
  data: Record<string, unknown>;
};

export function HistoryDetailClient({
  label,
  createdAt,
  data,
}: HistoryDetailProps) {
  const criteriaResult = data.criteriaResult as {
    items: { id: string; name: string; priority: number }[];
    consistency: {
      cr: number;
      isConsistent: boolean;
      lambdaMax: number;
      ci: number;
      ri: number;
    };
  } | null;

  const supplierResults = (data.supplierResults ?? []) as {
    criteriaId: string;
    criteriaName: string;
    items: { id: string; name: string; priority: number }[];
    consistency: { cr: number; isConsistent: boolean };
  }[];

  const ranking = (data.ranking ?? []) as {
    supplierId: string;
    supplierName: string;
    totalScore: number;
    scores: { criteriaId: string; criteriaName: string; score: number }[];
  }[];

  const warnings = (data.warnings ?? []) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/history"
          className="flex items-center gap-1 text-sm text-teal-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-teal-800">{label}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {createdAt.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700"
            >
              {w}
            </div>
          ))}
        </div>
      )}

      {!criteriaResult &&
        ranking.length === 0 &&
        supplierResults.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
            <Database className="h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              Data perhitungan tidak tersedia atau telah dihapus.
            </p>
          </div>
        )}

      {criteriaResult && (
        <ConsistencyAlert
          cr={criteriaResult.consistency.cr}
          isConsistent={criteriaResult.consistency.isConsistent}
          label="Kriteria"
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {criteriaResult && criteriaResult.items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-teal-800">
                Bobot Prioritas Kriteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CriteriaWeightChart data={criteriaResult.items} />
            </CardContent>
          </Card>
        )}

        {supplierResults.length > 0 && ranking.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-teal-800">
                Skor Pemasok per Kriteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SupplierScoreChart ranking={ranking} />
            </CardContent>
          </Card>
        )}
      </div>

      {ranking.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-teal-800">
              Peringkat Akhir Pemasok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResultTable ranking={ranking} />
          </CardContent>
        </Card>
      )}

      {supplierResults.map((sr) => (
        <Card key={sr.criteriaId}>
          <CardHeader>
            <CardTitle className="text-base text-teal-800">
              Bobot Prioritas Pemasok - {sr.criteriaName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConsistencyAlert
              cr={sr.consistency.cr}
              isConsistent={sr.consistency.isConsistent}
              label={sr.criteriaName}
            />
            <div className="mt-3 overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-0 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2">Pemasok</th>
                    <th className="px-3 py-2">Bobot</th>
                  </tr>
                </thead>
                <tbody>
                  {[...sr.items]
                    .sort((a, b) => b.priority - a.priority)
                    .map((item, idx) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                          {(item.priority * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
