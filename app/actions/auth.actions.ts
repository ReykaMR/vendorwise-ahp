"use server";

import { registerSchema } from "@/lib/validations/auth.validation";
import { userService } from "@/services/user.service";
import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export type RegisterState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
};

export async function registerUser(
  prevState: RegisterState | null,
  formData: FormData,
): Promise<RegisterState> {
  const validated = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validated.data;

  try {
    await userService.create({
      name,
      email,
      password,
      role: "USER",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          errors: {
            email: ["Email sudah terdaftar"],
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

export async function requestPasswordReset(email: string) {
  try {
    const user = await userService.getByEmail(email);
    if (!user) {
      return { success: true };
    }

    const existingTokens = await prisma.passwordResetToken.findMany({
      where: { email, usedAt: null, expiresAt: { gt: new Date() } },
    });

    for (const t of existingTokens) {
      await prisma.passwordResetToken.update({
        where: { id: t.id },
        data: { usedAt: new Date() },
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: rawToken,
        expiresAt,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password/${rawToken}`;

    return { success: true, resetLink };
  } catch {
    return { error: "Terjadi kesalahan server. Silakan coba lagi." };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return {
        success: false,
        error: "Token tidak valid atau sudah kedaluwarsa.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await userService.updatePassword(record.email, hashedPassword);

    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan server." };
  }
}
