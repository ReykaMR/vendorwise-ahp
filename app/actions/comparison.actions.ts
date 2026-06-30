"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { comparisonService } from "@/services/comparison.service";
import { saveComparisonSchema } from "@/lib/validations/comparison.validation";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak terautentikasi");
  return session.user;
}

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

export async function saveCell(
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

    await comparisonService.saveCell(
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
