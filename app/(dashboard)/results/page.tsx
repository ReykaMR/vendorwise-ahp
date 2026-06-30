import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { ahpService } from "@/services/ahp.service";
import { ResultsClient } from "./ResultsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hasil Perhitungan — VendorWise AHP",
  description:
    "Lihat hasil perhitungan AHP, bobot kriteria, skor pemasok, dan peringkat akhir.",
};

export default async function ResultsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const result = await ahpService.getLastResults(session.user.id);

  return (
    <ResultsClient
      initialResult={result.success ? result : null}
      initialError={
        result.warnings.length > 0 && !result.success
          ? result.warnings[0]
          : null
      }
    />
  );
}
