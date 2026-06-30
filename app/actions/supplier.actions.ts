"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { supplierService } from "@/services/supplier.service";
import {
  supplierCreateSchema,
  supplierUpdateSchema,
} from "@/lib/validations/supplier.validation";
import { Prisma } from "@/app/generated/prisma/client";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak terautentikasi");
  return session.user;
}

async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw new Error("Akses ditolak");
  return user;
}

export type CreateSupplierState = {
  success?: boolean;
  errors?: {
    name?: string[];
    address?: string[];
    contactPerson?: string[];
    phone?: string[];
    email?: string[];
    _form?: string[];
  };
};

export async function createSupplier(
  prevState: CreateSupplierState | null,
  formData: FormData,
): Promise<CreateSupplierState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return {
      errors: { _form: [err instanceof Error ? err.message : "Akses ditolak"] },
    };
  }

  const validated = supplierCreateSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    contactPerson: formData.get("contactPerson") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await supplierService.create(validated.data);
    revalidatePath("/suppliers");
    return { success: true };
  } catch {
    return { errors: { _form: ["Terjadi kesalahan server"] } };
  }
}

export type UpdateSupplierState = {
  success?: boolean;
  errors?: {
    name?: string[];
    address?: string[];
    contactPerson?: string[];
    phone?: string[];
    email?: string[];
    _form?: string[];
  };
};

export async function updateSupplier(
  supplierId: string,
  prevState: UpdateSupplierState | null,
  formData: FormData,
): Promise<UpdateSupplierState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return {
      errors: { _form: [err instanceof Error ? err.message : "Akses ditolak"] },
    };
  }

  const validated = supplierUpdateSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    contactPerson: formData.get("contactPerson") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await supplierService.update(supplierId, validated.data);
    revalidatePath("/suppliers");
    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { errors: { _form: ["Pemasok tidak ditemukan"] } };
    }
    return { errors: { _form: ["Terjadi kesalahan server"] } };
  }
}

export type DeleteSupplierState = {
  success?: boolean;
  error?: string;
};

export async function deleteSupplier(
  supplierId: string,
): Promise<DeleteSupplierState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Akses ditolak" };
  }

  try {
    await supplierService.delete(supplierId);
    revalidatePath("/suppliers");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus pemasok" };
  }
}
