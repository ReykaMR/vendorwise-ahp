import { NextRequest } from "next/server";
import { supplierService } from "@/services/supplier.service";
import { supplierCreateSchema } from "@/lib/validations/supplier.validation";
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
    const suppliers = await supplierService.list();
    return apiSuccess(suppliers);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return apiError("Tidak terautentikasi", 401);
    }
    return apiError("Gagal memuat pemasok", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json();
    const validated = supplierCreateSchema.safeParse(body);

    if (!validated.success) {
      const firstError =
        Object.values(validated.error.flatten().fieldErrors).flat()[0] ||
        "Data tidak valid";
      return apiError(firstError, 422);
    }

    const supplier = await supplierService.create(validated.data);
    return apiSuccess(supplier, 201);
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
    return apiError("Gagal membuat pemasok", 500);
  }
}
