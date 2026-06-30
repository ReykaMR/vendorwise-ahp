import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth/auth";
import { comparisonService } from "@/services/comparison.service";
import { CriteriaMatrix } from "@/components/comparison/CriteriaMatrix";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perbandingan Kriteria — VendorWise AHP",
  description:
    "Lakukan perbandingan berpasangan antar kriteria menggunakan skala Saaty 1–9.",
};

export default async function CriteriaComparisonPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const matrix = await comparisonService.getMatrix(session.user.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">
            Perbandingan Berpasangan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bandingkan tingkat kepentingan antar kriteria atau pemasok
            menggunakan skala Saaty 1–9
          </p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        <Link
          href="/comparison/criteria"
          className="rounded-t-lg border border-b-0 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-teal-700"
        >
          Perbandingan Kriteria
        </Link>
        <Link
          href="/comparison/suppliers"
          className="rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500 hover:text-teal-700"
        >
          Perbandingan Pemasok
        </Link>
      </div>

      <CriteriaMatrix initialData={matrix} />
    </div>
  );
}
