"use server";

import { registerSchema } from "@/lib/validations/auth.validation";
import { userService } from "@/services/user.service";
import { Prisma } from "@/app/generated/prisma/client";

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
        // Unique constraint failed (email)
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
