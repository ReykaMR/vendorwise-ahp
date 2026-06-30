import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import type { AHPResult } from "@/services/ahp.service";

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
  getNumberOfPages: () => number;
}

function getFinalY(doc: JsPDFWithAutoTable): number {
  const finalY = doc.lastAutoTable?.finalY;
  if (finalY === undefined) throw new Error("Gagal membuat tabel PDF");
  return finalY;
}

export function exportPDF(result: AHPResult): void {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();

  // -- Title --
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Hasil AHP", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 30);
  doc.text("Aplikasi: VendorWise AHP — SPK Pemilihan Pemasok", 14, 36);

  let y = 44;

  // -- Criteria Priorities --
  if (result.criteriaResult) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Bobot Prioritas Kriteria", 14, y);
    y += 6;

    const critBody = result.criteriaResult.items.map((item, i) => [
      String(i + 1),
      item.name,
      `${(item.priority * 100).toFixed(2)}%`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["No", "Kriteria", "Bobot"]],
      body: critBody,
      theme: "grid",
      headStyles: {
        fillColor: [13, 148, 136] as [number, number, number],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 10 },
    });
    y = getFinalY(doc) + 8;

    const cons = result.criteriaResult.consistency;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`CR: ${cons.cr.toFixed(4)}`, 14, y);
    doc.text(
      `Status: ${cons.isConsistent ? "Konsisten" : "Tidak Konsisten"}`,
      14,
      y + 5,
    );
    y += 14;
  }

  // -- Supplier Priorities per Criteria --
  if (result.supplierResults.length > 0) {
    doc.addPage();
    y = 20;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Bobot Prioritas Pemasok per Kriteria", 14, y);
    y += 8;

    for (const sr of result.supplierResults) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Kriteria: ${sr.criteriaName}`, 14, y);
      y += 6;

      const suppBody = sr.items.map((item, i) => [
        String(i + 1),
        item.name,
        `${(item.priority * 100).toFixed(2)}%`,
      ]);

      autoTable(doc, {
        startY: y,
        head: [["No", "Pemasok", "Bobot"]],
        body: suppBody,
        theme: "grid",
        headStyles: {
          fillColor: [13, 148, 136] as [number, number, number],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 10 },
      });
      y = getFinalY(doc) + 10;
    }
  }

  // -- Final Ranking --
  if (result.ranking.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    } else {
      y += 4;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Peringkat Akhir Pemasok", 14, y);
    y += 8;

    const scoreColumns =
      result.ranking[0]?.scores.map((s) => s.criteriaName) || [];
    const rankBody = result.ranking.map((r, i) => [
      String(i + 1),
      r.supplierName,
      `${(r.totalScore * 100).toFixed(2)}%`,
      ...r.scores.map((s) => `${(s.score * 100).toFixed(2)}%`),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Peringkat", "Pemasok", "Skor Akhir", ...scoreColumns]],
      body: rankBody,
      theme: "grid",
      headStyles: {
        fillColor: [234, 88, 12] as [number, number, number],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 9 },
    });
    y = getFinalY(doc) + 10;
  }

  // -- Footer --
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
  }

  doc.save("laporan-ahp-vendorwise.pdf");
}
