"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import {
  checkCriteriaConsistency,
  checkSupplierConsistency,
} from "@/app/actions/comparison.actions";

type ConsistencyBadgeProps = {
  type: "criteria" | "supplier";
  criteriaId?: string;
  saveVersion?: number;
};

export function ConsistencyBadge({
  type,
  criteriaId,
  saveVersion,
}: ConsistencyBadgeProps) {
  const [data, setData] = useState<{
    canCompute: boolean;
    cr?: number;
    isConsistent?: boolean;
    missing?: number;
    total?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fn =
      type === "criteria" ? checkCriteriaConsistency : checkSupplierConsistency;

    fn(criteriaId).then((result) => {
      if (!ignore) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [type, criteriaId, saveVersion]);

  if (loading && !data) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Memeriksa konsistensi...
      </div>
    );
  }

  if (!data) return null;

  if (!data.canCompute) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500">
        <AlertTriangle className="h-3 w-3 shrink-0" />
        {data.missing !== undefined &&
        data.total !== undefined &&
        data.missing > 0
          ? `Isi ${data.missing} dari ${data.total} perbandingan`
          : "Isi semua perbandingan untuk melihat konsistensi"}
      </div>
    );
  }

  if (data.isConsistent) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 text-xs text-green-700">
        <CheckCircle2 className="h-3 w-3 shrink-0" />
        Konsisten (CR = {data.cr!.toFixed(4)})
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
      <AlertTriangle className="h-3 w-3 shrink-0" />
      Tidak konsisten (CR = {data.cr!.toFixed(4)} &gt; 0.1) - sebaiknya revisi
    </div>
  );
}
