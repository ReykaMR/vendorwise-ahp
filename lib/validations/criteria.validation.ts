import { z } from "zod";

export const criteriaCreateSchema = z.object({
  name: z.string().min(2, "Nama kriteria minimal 2 karakter"),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export const criteriaUpdateSchema = z.object({
  name: z.string().min(2, "Nama kriteria minimal 2 karakter"),
  description: z.string().optional(),
  parentId: z.string().optional(),
});
