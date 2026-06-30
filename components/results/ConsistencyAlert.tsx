"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

type ConsistencyAlertProps = {
  cr: number;
  isConsistent: boolean;
  label: string;
};

export function ConsistencyAlert({
  cr,
  isConsistent,
  label,
}: ConsistencyAlertProps) {
  if (isConsistent) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
        <CheckCircle className="h-5 w-5 shrink-0" />
        <span>
          <strong>{label}:</strong> Konsisten (CR = {cr.toFixed(4)} &lt; 0,1)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <strong>{label}:</strong> Tidak konsisten (CR = {cr.toFixed(4)} &gt;{" "}
        0,1)
        <p className="mt-1 text-amber-600">
          Sebaiknya revisi nilai perbandingan berpasangan untuk meningkatkan
          konsistensi.
        </p>
      </div>
    </div>
  );
}
