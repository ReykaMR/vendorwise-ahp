import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth/auth";
import { comparisonService } from "@/services/comparison.service";
import { criteriaRepository } from "@/repositories/criteria.repository";
import { SupplierComparisonView } from "./SupplierComparisonView";

export default async function SuppliersComparisonPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const allCriteria = await criteriaRepository.findRoots();
  const sortedCriteria = allCriteria
    .map((c) => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const firstCriteriaId = sortedCriteria[0]?.id;
  let initialMatrix = null;

  if (firstCriteriaId) {
    initialMatrix = await comparisonService.getSupplierMatrix(
      session.user.id,
      firstCriteriaId,
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">
            Perbandingan Berpasangan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bandingkan tingkat kepentingan antar pemasok untuk setiap kriteria
          </p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        <Link
          href="/comparison/criteria"
          className="rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500 hover:text-teal-700"
        >
          Perbandingan Kriteria
        </Link>
        <Link
          href="/comparison/suppliers"
          className="rounded-t-lg border border-b-0 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-teal-700"
        >
          Perbandingan Pemasok
        </Link>
      </div>

      <SupplierComparisonView
        allCriteria={sortedCriteria}
        initialData={initialMatrix}
      />
    </div>
  );
}
