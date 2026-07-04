import { z } from "zod";

const saatyScaleValues = [
  1 / 9,
  1 / 8,
  1 / 7,
  1 / 6,
  1 / 5,
  1 / 4,
  1 / 3,
  1 / 2,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
] as const;

const comparisonValueSchema = z
  .number()
  .refine((val) => saatyScaleValues.some((s) => Math.abs(s - val) < 1e-10), {
    message: "Nilai harus berupa skala Saaty (1/9 – 9)",
  });

// ---- Criteria Comparison Schemas ----

export const saveComparisonSchema = z
  .object({
    criteria1Id: z.string().min(1, "ID kriteria 1 wajib diisi"),
    criteria2Id: z.string().min(1, "ID kriteria 2 wajib diisi"),
    value: comparisonValueSchema,
  })
  .refine((data) => data.criteria1Id !== data.criteria2Id, {
    message: "Tidak dapat membandingkan kriteria dengan dirinya sendiri",
    path: ["criteria2Id"],
  });

// ---- Supplier Comparison Schemas ----

export const saveSupplierComparisonSchema = z
  .object({
    criteriaId: z.string().min(1, "ID kriteria wajib diisi"),
    supplier1Id: z.string().min(1, "ID pemasok 1 wajib diisi"),
    supplier2Id: z.string().min(1, "ID pemasok 2 wajib diisi"),
    value: comparisonValueSchema,
  })
  .refine((data) => data.supplier1Id !== data.supplier2Id, {
    message: "Tidak dapat membandingkan pemasok dengan dirinya sendiri",
    path: ["supplier2Id"],
  });
