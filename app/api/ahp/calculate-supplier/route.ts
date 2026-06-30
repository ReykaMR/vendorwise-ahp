import { NextRequest } from "next/server";
import { supplierRepository } from "@/repositories/supplier.repository";
import { comparisonRepository } from "@/repositories/comparison.repository";
import { priorityRepository } from "@/repositories/priority.repository";
import { calculatePriorities } from "@/lib/ahp/priority";
import type { ComparisonInput } from "@/lib/ahp/matrix";
import { requireApiAuth, apiError, apiSuccess } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    const body = await request.json();
    const criteriaId = body.criteriaId as string | undefined;

    if (!criteriaId) {
      return apiError("Parameter criteriaId wajib diisi", 400);
    }

    const suppliers = await supplierRepository.findMany();
    if (suppliers.length < 2) {
      return apiError("Minimal 2 pemasok diperlukan", 400);
    }

    const supplierComparisons =
      await comparisonRepository.findSupplierByUserAndCriteria(
        user.id,
        criteriaId,
      );
    if (supplierComparisons.length === 0) {
      return apiError("Belum ada perbandingan pemasok untuk kriteria ini", 400);
    }

    const supplierEntities = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
    }));

    const supplierComparisonsInput: ComparisonInput[] = supplierComparisons.map(
      (c) => ({
        entity1Id: c.supplier1Id,
        entity2Id: c.supplier2Id,
        value: c.value,
      }),
    );

    const result = calculatePriorities(
      supplierEntities,
      supplierComparisonsInput,
    );

    await priorityRepository.deleteSupplierByUserAndCriteria(
      user.id,
      criteriaId,
    );
    for (const item of result.items) {
      await priorityRepository.upsertSupplier(
        user.id,
        criteriaId,
        item.id,
        item.priority,
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
    return apiError("Gagal menghitung prioritas pemasok", 500);
  }
}
