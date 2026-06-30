import * as XLSX from "xlsx";
import type { AHPResult } from "@/services/ahp.service";

export function exportExcel(result: AHPResult): void {
  const wb = XLSX.utils.book_new();

  // -- Sheet 1: Bobot Prioritas Kriteria --
  if (result.criteriaResult) {
    const critData = result.criteriaResult.items.map((item, i) => ({
      No: i + 1,
      Kriteria: item.name,
      Bobot: Number((item.priority * 100).toFixed(2)),
    }));

    critData.push({
      No: 0,
      Kriteria: "CR",
      Bobot: Number(
        (result.criteriaResult.consistency.cr * 100).toFixed(4),
      ),
    });
    critData.push({
      No: 0,
      Kriteria: "Status",
      Bobot: result.criteriaResult.consistency.isConsistent
        ? 1
        : 0,
    });

    const critSheet = XLSX.utils.json_to_sheet(critData);

    // Set column widths
    critSheet["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 10 },
    ];

    XLSX.utils.book_append_sheet(wb, critSheet, "Bobot Kriteria");
  }

  // -- Sheet 2: Bobot Prioritas Pemasok per Kriteria --
  if (result.supplierResults.length > 0) {
    const suppRows: {
      Kriteria: string;
      Pemasok: string;
      Bobot: number;
    }[] = [];

    for (const sr of result.supplierResults) {
      for (const item of sr.items) {
        suppRows.push({
          Kriteria: sr.criteriaName,
          Pemasok: item.name,
          Bobot: Number((item.priority * 100).toFixed(2)),
        });
      }
    }

    const suppSheet = XLSX.utils.json_to_sheet(suppRows);
    suppSheet["!cols"] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 10 },
    ];
    XLSX.utils.book_append_sheet(wb, suppSheet, "Bobot Pemasok");
  }

  // -- Sheet 3: Peringkat Akhir --
  if (result.ranking.length > 0) {
    const rankData = result.ranking.map((r, i) => {
      const row: Record<string, string | number> = {
        Peringkat: i + 1,
        "Nama Pemasok": r.supplierName,
        "Skor Akhir (%)": Number((r.totalScore * 100).toFixed(2)),
      };

      for (const score of r.scores) {
        row[score.criteriaName] = `${(score.score * 100).toFixed(2)}%`;
      }

      return row;
    });

    const rankSheet = XLSX.utils.json_to_sheet(rankData);
    rankSheet["!cols"] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
    ];

    const extraCols = result.ranking[0]?.scores.length || 0;
    for (let i = 0; i < extraCols; i++) {
      const colIdx = 3 + i;
      if (!rankSheet["!cols"]) rankSheet["!cols"] = [];
      rankSheet["!cols"][colIdx] = { wch: 20 };
    }

    XLSX.utils.book_append_sheet(wb, rankSheet, "Peringkat Akhir");
  }

  XLSX.writeFile(wb, "laporan-ahp-vendorwise.xlsx");
}
