"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPDF } from "@/lib/export/pdf";
import { exportExcel } from "@/lib/export/excel";
import type { AHPResult } from "@/services/ahp.service";

type ExportButtonsProps = {
  result: AHPResult;
};

export function ExportButtons({ result }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const hasData = result.ranking.length > 0;

  const handleExportPDF = async () => {
    setExporting("pdf");
    await new Promise((r) => setTimeout(r, 100));
    try {
      exportPDF(result);
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    await new Promise((r) => setTimeout(r, 100));
    try {
      exportExcel(result);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        disabled={!hasData || exporting !== null}
        onClick={handleExportPDF}
        className="border-teal-200 text-teal-700 hover:bg-teal-50"
      >
        {exporting === "pdf" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        Export PDF
      </Button>
      <Button
        variant="outline"
        disabled={!hasData || exporting !== null}
        onClick={handleExportExcel}
        className="border-teal-200 text-teal-700 hover:bg-teal-50"
      >
        {exporting === "excel" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        Export Excel
      </Button>
    </div>
  );
}
