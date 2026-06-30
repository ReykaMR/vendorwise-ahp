import { NextRequest } from "next/server";
import { supplierService } from "@/services/supplier.service";
import { supplierUpdateSchema } from "@/lib/validations/supplier.validation";
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
    const supplier = await supplierService.getById(id);
    if (!supplier) return apiError("Pemasok tidak ditemukan", 404);
    return apiSuccess(supplier);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return apiError("Tidak terautentikasi", 401);
    }
    return apiError("Gagal memuat pemasok", 500);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    const body = await request.json();
    const validated = supplierUpdateSchema.safeParse(body);

    if (!validated.success) {
      const firstError =
        Object.values(validated.error.flatten().fieldErrors).flat()[0] ||
        "Data tidak valid";
      return apiError(firstError, 422);
    }

    const supplier = await supplierService.update(id, validated.data);
    return apiSuccess(supplier);
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
    return apiError("Gagal mengupdate pemasok", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireApiAdmin();
    const { id } = await params;
    await supplierService.delete(id);
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
    return apiError("Gagal menghapus pemasok", 500);
  }
}
