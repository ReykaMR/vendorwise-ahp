import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { comparisonService } from "@/services/comparison.service";
import { CriteriaMatrix } from "@/components/comparison/CriteriaMatrix";

export default async function CriteriaComparisonPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const matrix = await comparisonService.getMatrix(session.user.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">
            Perbandingan Berpasangan Kriteria
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bandingkan tingkat kepentingan antar kriteria utama menggunakan
            skala Saaty 1–9
          </p>
        </div>
      </div>
      <CriteriaMatrix initialData={matrix} />
    </div>
  );
}
