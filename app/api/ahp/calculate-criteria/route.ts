import { criteriaRepository } from "@/repositories/criteria.repository";
import { comparisonRepository } from "@/repositories/comparison.repository";
import { priorityRepository } from "@/repositories/priority.repository";
import { calculatePriorities } from "@/lib/ahp/priority";
import type { ComparisonInput } from "@/lib/ahp/matrix";
import { requireApiAuth, apiError, apiSuccess } from "@/lib/api-auth";

export async function POST() {
  try {
    const user = await requireApiAuth();

    const rootCriteria = await criteriaRepository.findRoots();
    if (rootCriteria.length < 2) {
      return apiError("Minimal 2 kriteria utama diperlukan", 400);
    }

    const criteriaComparisons =
      await comparisonRepository.findCriteriaByUser(user.id);
    if (criteriaComparisons.length === 0) {
      return apiError("Belum ada perbandingan kriteria", 400);
    }

    const criteriaEntities = rootCriteria.map((c) => ({
      id: c.id,
      name: c.name,
    }));

    const criteriaComparisonsInput: ComparisonInput[] = criteriaComparisons.map(
      (c) => ({
        entity1Id: c.criteria1Id,
        entity2Id: c.criteria2Id,
        value: c.value,
      }),
    );

    const result = calculatePriorities(
      criteriaEntities,
      criteriaComparisonsInput,
    );

    await priorityRepository.deleteCriteriaByUser(user.id);
    for (const item of result.items) {
      await priorityRepository.upsertCriteria(
        user.id,
        item.id,
        item.priority,
        result.consistency.cr,
      );
    }

    return apiSuccess(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Gagal menghitung prioritas kriteria", 500);
  }
}
