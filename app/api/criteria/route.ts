import { NextRequest } from "next/server";
import { criteriaService } from "@/services/criteria.service";
import { criteriaCreateSchema } from "@/lib/validations/criteria.validation";
import {
  requireApiAuth,
  requireApiAdmin,
  apiError,
  apiSuccess,
  AuthenticationError,
  AuthorizationError,
} from "@/lib/api-auth";

export async function GET() {
  try {
    await requireApiAuth();
    const criteria = await criteriaService.getTree();
    return apiSuccess(criteria);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return apiError("Tidak terautentikasi", 401);
    }
    return apiError("Gagal memuat kriteria", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const validated = criteriaCreateSchema.safeParse(body);

    if (!validated.success) {
      const firstError =
        Object.values(validated.error.flatten().fieldErrors).flat()[0] ||
        "Data tidak valid";
      return apiError(firstError, 422);
    }

    const criteria = await criteriaService.create(validated.data);
    return apiSuccess(criteria, 201);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return apiError("Tidak terautentikasi", 401);
    }
    if (error instanceof AuthorizationError) {
      return apiError(error.message, 403);
    }
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Gagal membuat kriteria", 500);
  }
}
