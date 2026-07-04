"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { comparisonService } from "@/services/comparison.service";
import {
  saveComparisonSchema,
  saveSupplierComparisonSchema,
} from "@/lib/validations/comparison.validation";
import { criteriaRepository } from "@/repositories/criteria.repository";
import { supplierRepository } from "@/repositories/supplier.repository";
import { comparisonRepository } from "@/repositories/comparison.repository";
import { calculatePriorities } from "@/lib/ahp/priority";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak terautentikasi");
  return session.user;
}

// ---- Criteria Matrix ----

export type SaveCellState = {
  success?: boolean;
  error?: string;
};

export async function saveCriteriaCell(
  criteria1Id: string,
  criteria2Id: string,
  value: number,
): Promise<SaveCellState> {
  try {
    const user = await requireAuth();

    const validated = saveComparisonSchema.safeParse({
      criteria1Id,
      criteria2Id,
      value,
    });
    if (!validated.success) {
      return { error: "Nilai tidak valid" };
    }

    await comparisonService.saveCriteriaCell(
      user.id,
      validated.data.criteria1Id,
      validated.data.criteria2Id,
      validated.data.value,
    );

    revalidatePath("/comparison/criteria");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menyimpan",
    };
  }
}

// ---- Supplier Matrix ----

export async function getSupplierMatrix(criteriaId: string) {
  try {
    const user = await requireAuth();
    const matrix = await comparisonService.getSupplierMatrix(
      user.id,
      criteriaId,
    );
    return { success: true, data: matrix };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal memuat matriks",
    };
  }
}

export async function saveSupplierCell(
  criteriaId: string,
  supplier1Id: string,
  supplier2Id: string,
  value: number,
): Promise<SaveCellState> {
  try {
    const user = await requireAuth();

    const validated = saveSupplierComparisonSchema.safeParse({
      criteriaId,
      supplier1Id,
      supplier2Id,
      value,
    });
    if (!validated.success) {
      return { error: "Nilai tidak valid" };
    }

    await comparisonService.saveSupplierCell(
      user.id,
      validated.data.criteriaId,
      validated.data.supplier1Id,
      validated.data.supplier2Id,
      validated.data.value,
    );

    revalidatePath("/comparison/suppliers");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menyimpan",
    };
  }
}

// ---- Consistency Check ----

export async function checkCriteriaConsistency() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { canCompute: false, missing: 0, total: 0 };

    const criteria = await criteriaRepository.findRoots();
    if (criteria.length < 2) return { canCompute: false, missing: 0, total: 0 };

    const comparisons = await comparisonRepository.findCriteriaByUser(
      session.user.id,
    );

    const totalPairs = (criteria.length * (criteria.length - 1)) / 2;
    const missing = totalPairs - comparisons.length;

    if (missing > 0) return { canCompute: false, missing, total: totalPairs };

    const result = calculatePriorities(
      criteria.map((c) => ({ id: c.id, name: c.name })),
      comparisons.map((c) => ({
        entity1Id: c.criteria1Id,
        entity2Id: c.criteria2Id,
        value: c.value,
      })),
    );

    return {
      canCompute: true,
      cr: result.consistency.cr,
      isConsistent: result.consistency.isConsistent,
      missing: 0,
      total: totalPairs,
    };
  } catch {
    return { canCompute: false, missing: 0, total: 0 };
  }
}

export async function checkSupplierConsistency(criteriaId?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { canCompute: false, missing: 0, total: 0 };
    if (!criteriaId) return { canCompute: false, missing: 0, total: 0 };

    const suppliers = await supplierRepository.findMany();
    if (suppliers.length < 2)
      return { canCompute: false, missing: 0, total: 0 };

    const comparisons =
      await comparisonRepository.findSupplierByUserAndCriteria(
        session.user.id,
        criteriaId,
      );

    const totalPairs = (suppliers.length * (suppliers.length - 1)) / 2;
    const missing = totalPairs - comparisons.length;

    if (missing > 0) return { canCompute: false, missing, total: totalPairs };

    const result = calculatePriorities(
      suppliers.map((s) => ({ id: s.id, name: s.name })),
      comparisons.map((c) => ({
        entity1Id: c.supplier1Id,
        entity2Id: c.supplier2Id,
        value: c.value,
      })),
    );

    return {
      canCompute: true,
      cr: result.consistency.cr,
      isConsistent: result.consistency.isConsistent,
      missing: 0,
      total: totalPairs,
    };
  } catch {
    return { canCompute: false, missing: 0, total: 0 };
  }
}
