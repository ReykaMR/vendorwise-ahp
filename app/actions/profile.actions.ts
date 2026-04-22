"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth";
import { hashPassword, verifyPassword } from "@/lib/utils/password";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/validations/profile.validation";
import { Prisma } from "@/app/generated/prisma/client";

export type ProfileState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    _form?: string[];
  };
};

export type PasswordState = {
  success?: boolean;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmNewPassword?: string[];
    _form?: string[];
  };
};

// Update nama dan email
export async function updateProfile(
  prevState: ProfileState | null,
  formData: FormData,
): Promise<ProfileState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { errors: { _form: ["Tidak terautentikasi"] } };
  }

  const validated = updateProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email } = validated.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email: email.toLowerCase(),
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          errors: {
            email: ["Email sudah digunakan oleh pengguna lain"],
          },
        };
      }
    }
    return {
      errors: {
        _form: ["Terjadi kesalahan server. Silakan coba lagi."],
      },
    };
  }
}

// Ganti password
export async function changePassword(
  prevState: PasswordState | null,
  formData: FormData,
): Promise<PasswordState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { errors: { _form: ["Tidak terautentikasi"] } };
  }

  const validated = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = validated.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return { errors: { _form: ["Pengguna tidak ditemukan"] } };
    }

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return {
        errors: {
          currentPassword: ["Password saat ini salah"],
        },
      };
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    return {
      errors: {
        _form: ["Terjadi kesalahan server. Silakan coba lagi."],
      },
    };
  }
}
