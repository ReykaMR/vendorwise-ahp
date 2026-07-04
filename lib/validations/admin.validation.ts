import { z } from "zod";

const RoleEnum = z.enum(["ADMIN", "USER"]);

export const userCreateSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: RoleEnum.default("USER"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: RoleEnum.default("USER"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
