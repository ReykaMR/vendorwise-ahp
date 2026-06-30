import { NextRequest } from "next/server";
import { criteriaService } from "@/services/criteria.service";
import { criteriaUpdateSchema } from "@/lib/validations/criteria.validation";
import {
  requireApiAuth,
  requireApiAdmin,
  apiError,
  apiSuccess,
  AuthenticationError,
  AuthorizationError,
} from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth();
    const { id } = await params;
    const criteria = await criteriaService.getById(id);
    if (!criteria) return apiError("Kriteria tidak ditemukan", 404);
    return apiSuccess(criteria);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return apiError("Tidak terautentikasi", 401);
    }
    return apiError("Gagal memuat kriteria", 500);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const body = await request.json();
    const validated = criteriaUpdateSchema.safeParse(body);

    if (!validated.success) {
      const firstError =
        Object.values(validated.error.flatten().fieldErrors).flat()[0] ||
        "Data tidak valid";
      return apiError(firstError, 422);
    }

    const criteria = await criteriaService.update(id, validated.data);
    return apiSuccess(criteria);
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
    return apiError("Gagal mengupdate kriteria", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await criteriaService.delete(id);
    return apiSuccess({ deleted: true });
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
    return apiError("Gagal menghapus kriteria", 500);
  }
}
