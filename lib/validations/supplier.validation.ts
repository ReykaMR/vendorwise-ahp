import { z } from "zod";

export const supplierCreateSchema = z.object({
  name: z.string().min(2, "Nama pemasok minimal 2 karakter"),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
});

export const supplierUpdateSchema = z.object({
  name: z.string().min(2, "Nama pemasok minimal 2 karakter"),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
});

export type SupplierCreateInput = z.infer<typeof supplierCreateSchema>;
export type SupplierUpdateInput = z.infer<typeof supplierUpdateSchema>;
