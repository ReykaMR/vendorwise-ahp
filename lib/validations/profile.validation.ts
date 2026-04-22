import { z } from "zod";

// Update nama dan email
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Ganti password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini harus diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmNewPassword: z.string().min(8, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password baru dan konfirmasi tidak cocok",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
