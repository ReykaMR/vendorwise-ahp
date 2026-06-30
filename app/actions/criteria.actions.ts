"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { criteriaService } from "@/services/criteria.service";
import {
  criteriaCreateSchema,
  criteriaUpdateSchema,
} from "@/lib/validations/criteria.validation";
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

export type CreateCriteriaState = {
  success?: boolean;
  errors?: {
    name?: string[];
    description?: string[];
    parentId?: string[];
    _form?: string[];
  };
};

export async function createCriteria(
  prevState: CreateCriteriaState | null,
  formData: FormData,
): Promise<CreateCriteriaState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return {
      errors: { _form: [err instanceof Error ? err.message : "Akses ditolak"] },
    };
  }

  const validated = criteriaCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    parentId: formData.get("parentId") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await criteriaService.create(validated.data);
    revalidatePath("/criteria");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } };
    }
    return { errors: { _form: ["Terjadi kesalahan server"] } };
  }
}

export type UpdateCriteriaState = {
  success?: boolean;
  errors?: {
    name?: string[];
    description?: string[];
    parentId?: string[];
    _form?: string[];
  };
};

export async function updateCriteria(
  criteriaId: string,
  prevState: UpdateCriteriaState | null,
  formData: FormData,
): Promise<UpdateCriteriaState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return {
      errors: { _form: [err instanceof Error ? err.message : "Akses ditolak"] },
    };
  }

  const validated = criteriaUpdateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    parentId: formData.get("parentId") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await criteriaService.update(criteriaId, validated.data);
    revalidatePath("/criteria");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } };
    }
    return { errors: { _form: ["Terjadi kesalahan server"] } };
  }
}

export type DeleteCriteriaState = {
  success?: boolean;
  error?: string;
};

export async function deleteCriteria(
  criteriaId: string,
): Promise<DeleteCriteriaState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Akses ditolak" };
  }

  try {
    await criteriaService.delete(criteriaId);
    revalidatePath("/criteria");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus kriteria" };
  }
}
