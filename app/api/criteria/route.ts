import { NextRequest } from "next/server";
import { criteriaService } from "@/services/criteria.service";
import { criteriaCreateSchema } from "@/lib/validations/criteria.validation";
import { requireApiAuth, apiError, apiSuccess } from "@/lib/api-auth";

export async function GET() {
  try {
    await requireApiAuth();
    const criteria = await criteriaService.getTree();
    return apiSuccess(criteria);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    return apiError("Gagal memuat kriteria", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAuth();
    const body = await request.json();
    const validated = criteriaCreateSchema.safeParse(body);

    if (!validated.success) {
      return apiError(validated.error.flatten().fieldErrors as unknown as string, 422);
    }

    const criteria = await criteriaService.create(validated.data);
    return apiSuccess(criteria, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Gagal membuat kriteria", 500);
  }
}
