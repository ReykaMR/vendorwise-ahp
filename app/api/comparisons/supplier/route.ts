import { NextRequest } from "next/server";
import { comparisonService } from "@/services/comparison.service";
import { saveSupplierComparisonSchema } from "@/lib/validations/comparison.validation";
import { requireApiAuth, apiError, apiSuccess } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    const { searchParams } = new URL(request.url);
    const criteriaId = searchParams.get("criteriaId");

    if (!criteriaId) {
      return apiError("Parameter criteriaId wajib diisi", 400);
    }

    const matrix = await comparisonService.getSupplierMatrix(
      user.id,
      criteriaId,
    );
    return apiSuccess(matrix);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Gagal memuat matriks perbandingan pemasok", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    const body = await request.json();
    const validated = saveSupplierComparisonSchema.safeParse(body);

    if (!validated.success) {
      return apiError(validated.error.flatten().fieldErrors as unknown as string, 422);
    }

    const result = await comparisonService.saveSupplierCell(
      user.id,
      validated.data.criteriaId,
      validated.data.supplier1Id,
      validated.data.supplier2Id,
      validated.data.value,
    );
    return apiSuccess(result, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Gagal menyimpan perbandingan pemasok", 500);
  }
}
