"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/auth";
import { userService } from "@/services/user.service";
import {
  userCreateSchema,
  userUpdateSchema,
  resetPasswordSchema,
} from "@/lib/validations/admin.validation";
import { Prisma } from "@/app/generated/prisma/client";

// Cek otorisasi admin
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Tidak terautentikasi");
  if (session.user.role !== "ADMIN") throw new Error("Akses ditolak");
  return session.user;
}

// ---------- Create User ----------
export type CreateUserState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    _form?: string[];
  };
};

export async function createUser(
  prevState: CreateUserState | null,
  formData: FormData,
): Promise<CreateUserState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return {
      errors: { _form: [err instanceof Error ? err.message : "Akses ditolak"] },
    };
  }

  const validated = userCreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "USER",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validated.data;

  try {
    await userService.create({ name, email, password, role });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { errors: { email: ["Email sudah terdaftar"] } };
    }
    return { errors: { _form: ["Terjadi kesalahan server"] } };
  }
}

// ---------- Update User ----------
export type UpdateUserState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];
    _form?: string[];
  };
};

export async function updateUser(
  userId: string,
  prevState: UpdateUserState | null,
  formData: FormData,
): Promise<UpdateUserState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return {
      errors: { _form: [err instanceof Error ? err.message : "Akses ditolak"] },
    };
  }

  const validated = userUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role") || "USER",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, role } = validated.data;

  try {
    await userService.update(userId, { name, email, role });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { errors: { email: ["Email sudah digunakan"] } };
    }
    return { errors: { _form: ["Terjadi kesalahan server"] } };
  }
}

// ---------- Delete User ----------
export type DeleteUserState = {
  success?: boolean;
  error?: string;
};

export async function deleteUser(userId: string): Promise<DeleteUserState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Akses ditolak" };
  }

  try {
    // Cegah admin menghapus dirinya sendiri
    const session = await getServerSession(authOptions);
    if (session?.user?.id === userId) {
      return { error: "Tidak dapat menghapus akun sendiri" };
    }

    await userService.delete(userId);
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus pengguna" };
  }
}

// ---------- Reset Password ----------
export type ResetPasswordState = {
  success?: boolean;
  errors?: {
    newPassword?: string[];
    _form?: string[];
  };
};

export async function resetUserPassword(
  userId: string,
  prevState: ResetPasswordState | null,
  formData: FormData,
): Promise<ResetPasswordState> {
  try {
    await requireAdmin();
  } catch (err: unknown) {
    return {
      errors: { _form: [err instanceof Error ? err.message : "Akses ditolak"] },
    };
  }

  const validated = resetPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await userService.resetPassword(userId, validated.data.newPassword);
    return { success: true };
  } catch {
    return { errors: { _form: ["Gagal mereset password"] } };
  }
}
