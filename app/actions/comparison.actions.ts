"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { comparisonService } from "@/services/comparison.service";
import {
  saveComparisonSchema,
  saveSupplierComparisonSchema,
} from "@/lib/validations/comparison.validation";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak terautentikasi");
  return session.user;
}

// ---- Criteria Matrix ----

export async function getCriteriaMatrix() {
  try {
    const user = await requireAuth();
    const matrix = await comparisonService.getMatrix(user.id);
    return { success: true, data: matrix };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal memuat matriks",
    };
  }
}

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
