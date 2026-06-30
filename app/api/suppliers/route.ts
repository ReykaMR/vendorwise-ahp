import { NextRequest } from "next/server";
import { supplierService } from "@/services/supplier.service";
import { supplierCreateSchema } from "@/lib/validations/supplier.validation";
import { requireApiAuth, apiError, apiSuccess } from "@/lib/api-auth";

export async function GET() {
  try {
    await requireApiAuth();
    const suppliers = await supplierService.list();
    return apiSuccess(suppliers);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    return apiError("Gagal memuat pemasok", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAuth();
    const body = await request.json();
    const validated = supplierCreateSchema.safeParse(body);

    if (!validated.success) {
      return apiError(validated.error.flatten().fieldErrors as unknown as string, 422);
    }

    const supplier = await supplierService.create(validated.data);
    return apiSuccess(supplier, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Tidak terautentikasi") {
      return apiError("Tidak terautentikasi", 401);
    }
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Gagal membuat pemasok", 500);
  }
}
