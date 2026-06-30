import { z } from "zod";
import { Role } from "@/app/generated/prisma/client";

export const userCreateSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.nativeEnum(Role).default(Role.USER),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.nativeEnum(Role).default(Role.USER),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
