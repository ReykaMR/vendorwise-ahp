import { NextRequest } from "next/server";
import { comparisonService } from "@/services/comparison.service";
import { saveComparisonSchema } from "@/lib/validations/comparison.validation";
import { requireApiAuth, apiError, apiSuccess } from "@/lib/api-auth";

export async function GET() {
  try {
    const user = await requireApiAuth();
    const matrix = await comparisonService.getMatrix(user.id);
    return apiSuccess(matrix);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    return apiError("Gagal memuat matriks perbandingan kriteria", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    const body = await request.json();
    const validated = saveComparisonSchema.safeParse(body);

    if (!validated.success) {
      return apiError(validated.error.flatten().fieldErrors as unknown as string, 422);
    }

    const result = await comparisonService.saveCriteriaCell(
      user.id,
      validated.data.criteria1Id,
      validated.data.criteria2Id,
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
    return apiError("Gagal menyimpan perbandingan kriteria", 500);
  }
}
