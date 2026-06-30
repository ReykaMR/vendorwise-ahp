"use client";

import { FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPDF } from "@/lib/export/pdf";
import { exportExcel } from "@/lib/export/excel";
import type { AHPResult } from "@/services/ahp.service";

type ExportButtonsProps = {
  result: AHPResult;
};

export function ExportButtons({ result }: ExportButtonsProps) {
  const hasData = result.ranking.length > 0;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        disabled={!hasData}
        onClick={() => exportPDF(result)}
        className="border-teal-200 text-teal-700 hover:bg-teal-50"
      >
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button
        variant="outline"
        disabled={!hasData}
        onClick={() => exportExcel(result)}
        className="border-teal-200 text-teal-700 hover:bg-teal-50"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
    </div>
  );
}
