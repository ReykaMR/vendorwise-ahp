"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

type SaveIndicatorProps = {
  saving: boolean;
  saveVersion: number;
};

export function SaveIndicator({ saving, saveVersion }: SaveIndicatorProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (saveVersion > 0 && !saving) {
      const id = setTimeout(() => setShowSuccess(true), 0);
      return () => clearTimeout(id);
    }
  }, [saveVersion, saving]);

  useEffect(() => {
    if (!showSuccess) return;
    const id = setTimeout(() => setShowSuccess(false), 2000);
    return () => clearTimeout(id);
  }, [showSuccess]);

  if (saving) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 transition-all">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Menyimpan...
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-all">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Tersimpan
      </div>
    );
  }

  return null;
}
